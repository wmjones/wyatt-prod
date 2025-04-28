provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = terraform.workspace
      ManagedBy   = "Terraform"
    }
  }
}

module "static_site" {
  source = "./modules/static_site"

  bucket_name = "${lower(var.project_name)}-app-${terraform.workspace}-${random_id.bucket_suffix.hex}"
  domain_name = var.domain_name
  
  # Control certificate validation behavior
  create_dns_records = false  # Set to true if you want to automate DNS validation via Route53
  use_default_cert   = true   # Set to false once you've validated your certificate manually

  tags = {
    Component = "Frontend"
  }

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}