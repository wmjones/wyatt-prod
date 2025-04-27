resource "aws_s3_bucket" "static_site" {
  bucket = var.bucket_name
  
  tags = {
    Name = "Static Website Bucket"
  }
}

resource "aws_s3_bucket_website_configuration" "static_site" {
  bucket = aws_s3_bucket.static_site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static_site" {
  bucket = aws_s3_bucket.static_site.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "static_site" {
  bucket = aws_s3_bucket.static_site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "logs" {
  bucket = "${var.bucket_name}-logs"
  
  tags = {
    Name = "CloudFront Logs Bucket"
  }
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "logs" {
  depends_on = [aws_s3_bucket_ownership_controls.logs]
  
  bucket = aws_s3_bucket.logs.id
  acl    = "private"
}

resource "aws_cloudfront_origin_access_control" "static_site" {
  name                              = "${var.bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Find the Route 53 zone for the domain
data "aws_route53_zone" "domain" {
  count = var.create_dns_records ? 1 : 0
  
  name         = var.domain_name
  private_zone = false
}

# Create the ACM certificate
resource "aws_acm_certificate" "cert" {
  provider = aws.us_east_1  # ACM certificates for CloudFront must be in us-east-1
  
  domain_name       = "app.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Create DNS validation records if enabled
resource "aws_route53_record" "cert_validation" {
  for_each = var.create_dns_records ? {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.domain[0].zone_id
}

# Create ACM certificate validation resource if DNS records are enabled
resource "aws_acm_certificate_validation" "cert" {
  count = var.create_dns_records ? 1 : 0
  
  provider = aws.us_east_1
  
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Create alias record for CloudFront distribution
resource "aws_route53_record" "cloudfront_alias" {
  count = var.create_dns_records ? 1 : 0
  
  zone_id = data.aws_route53_zone.domain[0].zone_id
  name    = "app.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.static_site.domain_name
    zone_id                = aws_cloudfront_distribution.static_site.hosted_zone_id
    evaluate_target_health = false
  }
}

# Add local-exec provisioner to output DNS validation instructions if not creating records
resource "null_resource" "dns_validation_instructions" {
  count = var.create_dns_records ? 0 : 1
  
  provisioner "local-exec" {
    command = <<-EOF
      echo "================================================================"
      echo "IMPORTANT: Manual DNS validation required for HTTPS certificate!"
      echo "Add the following DNS record to your domain to validate the ACM certificate:"
      echo "Name: ${aws_acm_certificate.cert.domain_validation_options[0].resource_record_name}"
      echo "Type: ${aws_acm_certificate.cert.domain_validation_options[0].resource_record_type}"
      echo "Value: ${aws_acm_certificate.cert.domain_validation_options[0].resource_record_value}"
      echo "================================================================"
    EOF
  }
  
  depends_on = [aws_acm_certificate.cert]
}

resource "aws_cloudfront_distribution" "static_site" {
  origin {
    domain_name              = aws_s3_bucket.static_site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.static_site.id
    origin_id                = "S3-${var.bucket_name}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"  # Use only North America and Europe edge locations

  # Use aliases conditionally based on certificate validation
  aliases = var.use_default_cert ? [] : ["app.${var.domain_name}"]

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.logs.bucket_regional_domain_name
    prefix          = "cf-logs/"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  # Don't cache index.html
  ordered_cache_behavior {
    path_pattern     = "index.html"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.use_default_cert ? null : (var.create_dns_records ? aws_acm_certificate_validation.cert[0].certificate_arn : aws_acm_certificate.cert.arn)
    cloudfront_default_certificate = var.use_default_cert
    ssl_support_method       = var.use_default_cert ? null : "sni-only"
    minimum_protocol_version = var.use_default_cert ? null : "TLSv1.2_2021"
  }
  
  # This is important for SPA routing
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
}

resource "aws_s3_bucket_policy" "static_site" {
  bucket = aws_s3_bucket.static_site.id
  
  # This policy will be applied AFTER the public access block is configured
  depends_on = [aws_s3_bucket_public_access_block.static_site]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static_site.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.static_site.arn
          }
        }
      }
    ]
  })
}

resource "aws_s3_object" "sample_html" {
  bucket = aws_s3_bucket.static_site.id
  key    = "index.html"
  content = <<-EOF
    <!DOCTYPE html>
    <html>
    <head>
      <title>Site Working</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
          color: #4CAF50;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Site Working!</h1>
        <p>Your static website is successfully deployed.</p>
      </div>
    </body>
    </html>
  EOF
  content_type = "text/html"

  depends_on = [aws_s3_bucket_policy.static_site]
}

resource "aws_s3_object" "error_html" {
  bucket = aws_s3_bucket.static_site.id
  key    = "error.html"
  content = <<-EOF
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
          color: #f44336;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Error</h1>
        <p>Something went wrong. Please try again later.</p>
      </div>
    </body>
    </html>
  EOF
  content_type = "text/html"

  depends_on = [aws_s3_bucket_policy.static_site]
}