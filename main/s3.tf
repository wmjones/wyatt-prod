resource "aws_s3_bucket" "wyatt-datalake-35315550" {
  bucket = "step-function-bucket-35315550"

}

# Generate random suffix for bucket name to ensure uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

module "visualization_data_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 3.0"

  bucket = "wyatt-visualization-data-${random_id.bucket_suffix.hex}"

  # Block public access when using Cognito + API Gateway
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # Enable versioning for data protection
  versioning = {
    enabled = true
  }

  # Server-side encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  # CORS configuration
  cors_rule = [
    {
      allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
      allowed_origins = ["https://${var.app_prefix}.${var.domain_name}", "http://localhost:3000"]
      allowed_headers = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
    }
  ]

  # Optional lifecycle rules for managing storage costs
  lifecycle_rule = [
    {
      id      = "transition-to-ia"
      enabled = true

      filter = {
        prefix = ""
      }

      transition = [
        {
          days          = 30
          storage_class = "STANDARD_IA"
        }
      ]
    }
  ]

  tags = {
    Component = "D3 Dashboard"
    Name      = "Visualization Data"
  }
}

# Policy document for access by authenticated users
data "aws_iam_policy_document" "visualization_data_policy" {
  # Allow authenticated users to access their own objects
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    resources = [
      "${module.visualization_data_bucket.s3_bucket_arn}/$${cognito-identity.amazonaws.com:sub}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "aws:PrincipalTag/sub"
      values   = ["$${cognito-identity.amazonaws.com:sub}"]
    }
  }
}
