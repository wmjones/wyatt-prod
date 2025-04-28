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

# Create a CloudFront function for URL rewrites if needed
locals {
  cloudfront_function_code = <<EOF
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Handle routes for single page application
    if (!uri.includes('.') && !uri.startsWith('/api/')) {
        request.uri = '/index.html';
    }
    
    return request;
}
EOF
}

module "frontend" {
  source = "./modules/frontend"

  bucket_name = "${lower(var.project_name)}-app-${terraform.workspace}-${random_id.bucket_suffix.hex}"
  domain_name = var.domain_name
  app_prefix  = var.app_prefix
  
  # Control certificate validation behavior
  create_dns_records = false  # Set to true if you want to automate DNS validation via Route53
  use_default_cert   = true   # Set to false once you've validated your certificate manually

  # Enable single page application behavior
  single_page_application = true
  
  # Add API Gateway integration
  api_gateway_endpoint   = module.api_gateway.api_endpoint
  enable_api_cache_behavior = true
  api_path_pattern       = "/api/*"
  
  # Add CloudFront function for URL rewrites
  cloudfront_function_code = local.cloudfront_function_code

  tags = {
    Component = "Frontend"
  }

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}