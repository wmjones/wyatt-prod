variable "TODOIST_API_TOKEN" {
  description = "API key for Todoist"
  default     = ""
}

variable "OPENAI_API_KEY" {
  description = "API key for ChatGPT"
  default     = ""
}

# data "archive_file" "lambda" {
#   type        = "zip"
#   source_file = "lambda.js"
#   output_path = "lambda_function_payload.zip"
# }

resource "aws_lambda_function" "todoist_lambda" {
  filename         = "deployment_package.zip"
  function_name    = "todoist_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "getTodoist.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.8"
  source_code_hash = filebase64sha256("deployment_package.zip")
  environment {
    variables = {
      TODOIST_API_KEY = var.TODOIST_API_TOKEN
      S3_BUCKET_NAME  = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}

resource "aws_lambda_function" "chatgpt_lambda" {
  filename         = "deployment_package.zip"
  function_name    = "ChatGPT_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "putChatGPT.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.8"
  source_code_hash = filebase64sha256("deployment_package.zip")
  environment {
    variables = {
      TODOIST_API_KEY = var.OPENAI_API_KEY
      S3_BUCKET_NAME  = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}

resource "aws_lambda_function" "notion_lambda" {
  filename         = "deployment_package.zip"
  function_name    = "notion_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "putNotion.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.8"
  source_code_hash = filebase64sha256("deployment_package.zip")
  environment {
    variables = {
      TODOIST_API_KEY = var.OPENAI_API_KEY
      S3_BUCKET_NAME  = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}
