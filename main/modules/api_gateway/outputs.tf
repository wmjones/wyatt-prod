output "api_id" {
  description = "The API Gateway ID"
  value       = module.api_gateway.apigatewayv2_api_id
}

output "api_endpoint" {
  description = "The API Gateway endpoint URL"
  value       = module.api_gateway.apigatewayv2_api_api_endpoint
}

output "api_arn" {
  description = "The API Gateway ARN"
  value       = module.api_gateway.apigatewayv2_api_arn
}

output "stage_id" {
  description = "The default stage ID"
  value       = module.api_gateway.default_apigatewayv2_stage_id
}

output "custom_domain_url" {
  description = "Custom domain URL for the API Gateway"
  value       = var.create_custom_domain ? "https://${var.domain_name}" : null
}
