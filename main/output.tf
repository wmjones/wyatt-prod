# S3 Bucket Outputs
output "s3_bucket_name" {
  description = "Name of the S3 bucket for the Todoist data lake"
  value       = aws_s3_bucket.wyatt-datalake-35315550.bucket
}

# Step Function Outputs
output "step_function_arn" {
  description = "ARN of the Todoist workflow Step Function"
  value       = module.todoist_workflow.state_machine_arn
}

# Frontend Outputs
output "website_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend website"
  value       = module.frontend.bucket_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.frontend.cloudfront_distribution_id
}

output "website_url" {
  description = "URL of the frontend website"
  value       = module.frontend.website_url
}

# Visualization Data Bucket
output "visualization_data_bucket_name" {
  description = "Name of the S3 bucket for visualization data"
  value       = module.visualization_data_bucket.s3_bucket_id
}

# API Gateway Outputs
output "api_endpoint" {
  description = "The API Gateway endpoint URL"
  value       = module.api_gateway.api_endpoint
}

# WebSocket API Output
output "websocket_api_endpoint" {
  description = "The WebSocket API Gateway endpoint URL"
  value       = aws_apigatewayv2_stage.websocket.invoke_url
}

# AWS Region Output
output "aws_region" {
  description = "AWS Region where resources are deployed"
  value       = data.aws_region.current.name
}

# Cognito Outputs
output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "ID of the Cognito User Pool web client"
  value       = module.cognito.client_ids["${var.project_name}-web-client"]
}

# Visualization Lambda Outputs
output "visualization_lambdas" {
  description = "ARNs of the Lambda functions for visualization data"
  value = {
    get           = module.get_visualization_lambda.function_arn
    update        = module.update_visualization_lambda.function_arn
    ws_connect    = module.ws_connect_lambda.function_arn
    ws_disconnect = module.ws_disconnect_lambda.function_arn
  }
}

# Existing Productivity Lambda Outputs
output "productivity_lambdas" {
  description = "ARNs of the Lambda functions for the productivity workflow"
  value = {
    todoist     = module.todoist_lambda.function_arn
    chatgpt     = module.chatgpt_lambda.function_arn
    notion      = module.notion_lambda.function_arn
    put_todoist = module.put_todoist_lambda.function_arn
  }
}
