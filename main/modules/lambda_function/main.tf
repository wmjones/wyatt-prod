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
