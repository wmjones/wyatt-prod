output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}

output "client_ids" {
  description = "Map of client IDs"
  value       = { for k, v in aws_cognito_user_pool_client.clients : k => v.id }
}

output "client_secrets" {
  description = "Map of client secrets"
  value       = { for k, v in aws_cognito_user_pool_client.clients : k => v.client_secret if v.generate_secret }
  sensitive   = true
}

output "domain" {
  description = "Cognito User Pool domain"
  value       = "${var.domain_prefix}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

# Get current AWS region for the domain output
data "aws_region" "current" {}
