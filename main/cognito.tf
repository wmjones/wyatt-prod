module "cognito" {
  source = "./modules/cognito"
  
  user_pool_name     = "${var.project_name}-user-pool-${terraform.workspace}"
  domain_prefix      = var.cognito_domain_prefix
  deletion_protection = terraform.workspace == "prod" ? true : false
  
  # Define app client for web application
  clients = [
    {
      name                         = "${var.project_name}-web-client"
      generate_secret              = false
      callback_urls                = ["https://${var.app_prefix}.${var.domain_name}/callback", "http://localhost:3000/callback"]
      logout_urls                  = ["https://${var.app_prefix}.${var.domain_name}", "http://localhost:3000"]
      allowed_oauth_flows          = ["implicit", "code"]
      allowed_oauth_scopes         = ["openid", "email", "profile"]
      allowed_oauth_flows_user_pool_client = true
      supported_identity_providers = ["COGNITO"]
    }
  ]
  
  tags = {
    Component = "Authentication"
    Name      = "User Pool"
  }
}