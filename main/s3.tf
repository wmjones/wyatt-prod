resource "aws_s3_bucket" "wyatt-datalake-35315550" {
  bucket = "step-function-bucket-35315550"
  
}

# S3 bucket for visualization data
resource "aws_s3_bucket" "visualization_data_bucket" {
  bucket = "wyatt-visualization-data-${random_id.bucket_suffix.hex}"
}

# Generate random suffix for bucket name to ensure uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Enable CORS for the bucket to allow web access
resource "aws_s3_bucket_cors_configuration" "visualization_cors" {
  bucket = aws_s3_bucket.visualization_data_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["*"]  # In production, restrict to your domain
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Add Block Public Access settings first - important!
resource "aws_s3_bucket_public_access_block" "visualization_data_bucket" {
  bucket = aws_s3_bucket.visualization_data_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Add bucket policy AFTER configuring public access block
resource "aws_s3_bucket_policy" "allow_access_from_webapp" {
  depends_on = [aws_s3_bucket_public_access_block.visualization_data_bucket]
  
  bucket = aws_s3_bucket.visualization_data_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.visualization_data_bucket.arn}/*"
      }
    ]
  })
}

# Add permissions to existing lambda_role to access visualization data
resource "aws_iam_role_policy" "visualization_lambda_policy" {
  name   = "visualization_lambda_policy"
  role   = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Effect   = "Allow"
        Resource = [
          "${aws_s3_bucket.visualization_data_bucket.arn}",
          "${aws_s3_bucket.visualization_data_bucket.arn}/*"
        ]
      }
    ]
  })
}