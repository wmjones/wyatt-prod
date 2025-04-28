output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito_user_pool.id
}

output "user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = module.cognito_user_pool.arn
}

output "user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = module.cognito_user_pool.endpoint
}

output "client_ids" {
  description = "Map of client IDs"
  value       = module.cognito_user_pool.client_ids
}

output "client_secrets" {
  description = "Map of client secrets"
  value       = module.cognito_user_pool.client_secrets
  sensitive   = true
}

output "domain" {
  description = "Cognito User Pool domain"
  value       = "${var.domain_prefix}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

# Get current AWS region for the domain output
data "aws_region" "current" {}