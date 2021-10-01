module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "wyatt-datalake"
  acl    = "private"

  force_destroy = true

  versioning = {
    enabled = true
  }

  lifecycle_rule = [{
    id      = "log"
    enabled = true
    prefix  = "data/"

    transition = [{
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }]
    }
  ]
}
