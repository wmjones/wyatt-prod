module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "datalake"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = true
  }

  lifecycle_rule = [{
    transition = [{
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }]
    }
  ]
}