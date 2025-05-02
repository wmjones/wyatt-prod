module "cognito" {
  source = "./modules/cognito"

  environment         = var.environment
  user_pool_name      = "${var.project_name}-user-pool-${var.environment}"
  domain_prefix       = var.cognito_domain_prefix
  deletion_protection = var.cognito_deletion_protection

  # Define app client for web application
  clients = [
    {
      name                                 = "${var.project_name}-web-client-${var.environment}"
      generate_secret                      = false
      callback_urls                        = ["https://${var.app_prefix}.${var.domain_name}/callback", "http://localhost:3000/callback"]
      logout_urls                          = ["https://${var.app_prefix}.${var.domain_name}", "http://localhost:3000"]
      allowed_oauth_flows                  = ["implicit", "code"]
      allowed_oauth_scopes                 = ["openid", "email", "profile"]
      allowed_oauth_flows_user_pool_client = true
      supported_identity_providers         = ["COGNITO"]
    }
  ]

  tags = {
    Component   = "Authentication"
    Name        = "User Pool"
    Environment = var.environment
  }
}
