module "lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 4.0"

  function_name = var.function_name
  description   = var.description
  handler       = var.handler
  runtime       = var.runtime

  create_package         = false
  local_existing_package = var.zip_file

  timeout     = var.timeout
  memory_size = var.memory_size

  environment_variables = var.environment_variables

  attach_policy_statements = true
  policy_statements        = var.policy_statements

  tags = var.tags
}

# Handle CloudWatch log groups using AWS provider directly
resource "aws_cloudwatch_log_group" "lambda" {
  # Only create if create_log_group is true
  count = var.create_log_group ? 1 : 0

  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}
