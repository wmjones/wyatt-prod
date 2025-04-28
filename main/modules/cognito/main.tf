resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  # Username and email configuration
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy settings
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  # MFA configuration
  mfa_configuration = "OFF"

  # Uncomment this if you want to use MFA (requires mfa_configuration = "OPTIONAL" or "REQUIRED")
  # software_token_mfa_configuration {
  #   enabled = true
  # }

  # Email provider configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # User pool deletion protection
  deletion_protection = var.deletion_protection ? "ACTIVE" : "INACTIVE"

  # User attributes
  schema {
    name                     = "name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      min_length = 3
      max_length = 100
    }
  }

  schema {
    name                     = "preferred_username"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false

    string_attribute_constraints {
      min_length = 3
      max_length = 100
    }
  }

  tags = var.tags
}

# Domain configuration
resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.domain_prefix
  user_pool_id = aws_cognito_user_pool.main.id
}

# Create app clients from the variable
resource "aws_cognito_user_pool_client" "clients" {
  for_each = { for idx, client in var.clients : client.name => client }

  name                                 = each.value.name
  user_pool_id                         = aws_cognito_user_pool.main.id
  generate_secret                      = each.value.generate_secret
  callback_urls                        = each.value.callback_urls
  logout_urls                          = each.value.logout_urls
  allowed_oauth_flows                  = each.value.allowed_oauth_flows
  allowed_oauth_scopes                 = each.value.allowed_oauth_scopes
  allowed_oauth_flows_user_pool_client = each.value.allowed_oauth_flows_user_pool_client
  supported_identity_providers         = each.value.supported_identity_providers
}
