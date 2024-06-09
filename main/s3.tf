locals {
  bucket_name = "wyatt-lake"
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
    id      = "step_function_bucket"
    enabled = true
    prefix  = "step_function_bucket/"

    transition = [{
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }]
    }
  ]
}

resource "aws_s3_bucket" "step_function_bucket" {
  bucket = local.bucket_name
}
