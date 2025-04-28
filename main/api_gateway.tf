module "api_gateway" {
  source = "./modules/api_gateway"

  api_name        = "dashboard-api"
  api_description = "API for D3 Dashboard visualization data"

  allowed_origins = ["https://${var.app_prefix}.${var.domain_name}", "http://localhost:3000"]

  create_logs          = true
  create_custom_domain = false

  # Integration with Lambda functions for API routes
  integrations = {
    "GET /api/visualizations" = {
      integration_uri        = module.get_visualization_data.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    },

    "GET /api/visualizations/{id}" = {
      integration_uri        = module.get_visualization_data.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    },

    "POST /api/visualizations" = {
      integration_uri        = module.put_visualization_data.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    },

    "PUT /api/visualizations/{id}" = {
      integration_uri        = module.put_visualization_data.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    },

    "DELETE /api/visualizations/{id}" = {
      integration_uri        = module.put_visualization_data.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    }
  }

  tags = {
    Component = "D3 Dashboard"
    Name      = "Visualization API"
  }
}

# Create Lambda permissions for API Gateway
resource "aws_lambda_permission" "api_gateway_get" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.get_visualization_data.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api_gateway.api_arn}/*"
}

resource "aws_lambda_permission" "api_gateway_put" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.put_visualization_data.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api_gateway.api_arn}/*"
}
