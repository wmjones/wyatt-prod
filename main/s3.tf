locals {
  bucket_name = "wyatt-datalake"
}

module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = local.bucket_name
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = true
  }

  lifecycle_rule = [{
    id      = "data"
    enabled = true
    prefix  = "data/"

    transition = [{
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }]
    }
  ]
}

resource "aws_s3_bucket" "data" {
  bucket = local.bucket_name
}
