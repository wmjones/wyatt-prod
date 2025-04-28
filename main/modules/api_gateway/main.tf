module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 2.0"

  name          = var.api_name
  description   = var.api_description
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"]
    allow_origins = var.allowed_origins
    allow_credentials = true
  }

  # Custom domain
  domain_name                 = var.create_custom_domain ? var.domain_name : null
  domain_name_certificate_arn = var.create_custom_domain ? var.certificate_arn : null

  # Access logs
  default_stage_access_log_destination_arn = var.create_logs ? aws_cloudwatch_log_group.api_gateway[0].arn : null
  default_stage_access_log_format          = var.create_logs ? "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage" : null

  # Routes and integrations
  integrations = var.integrations

  tags = var.tags
}

# Create CloudWatch log group if logs are enabled
resource "aws_cloudwatch_log_group" "api_gateway" {
  count = var.create_logs ? 1 : 0
  
  name              = "/aws/apigateway/${var.api_name}-${terraform.workspace}"
  retention_in_days = 7
  
  tags = var.tags
}