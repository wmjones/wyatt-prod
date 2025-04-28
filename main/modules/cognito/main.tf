module "cognito_user_pool" {
  source  = "terraform-aws-modules/cognito-user-pool/aws"
  version = "~> 1.0"

  user_pool_name = var.user_pool_name

  # Username and email configuration
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy and MFA settings
  password_policy = {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  mfa_configuration = "OPTIONAL"
  
  # Email provider configuration
  email_configuration = {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Domain configuration
  domain = var.domain_prefix
  
  # Clients
  clients = var.clients
  
  # User attributes
  schema_attributes = [
    {
      name       = "name"
      required   = true
      mutable    = true
      attribute_data_type      = "String"
      developer_only_attribute = false
      
      string_attribute_constraints = {
        min_length = 3
        max_length = 100
      }
    },
    {
      name       = "preferred_username"
      required   = false
      mutable    = true
      attribute_data_type      = "String"
      developer_only_attribute = false
      
      string_attribute_constraints = {
        min_length = 3
        max_length = 100
      }
    }
  ]

  # User pool deletion protection (set to true in production)
  deletion_protection = var.deletion_protection

  tags = var.tags
}