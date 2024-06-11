variable "TODOIST_API_TOKEN" {
  description = "API key for Todoist"
  default     = ""
}

variable "OPEN_AI_KEY" {
  description = "API key for ChatGPT"
  default     = ""
}

variable "NOTION_API_TOKEN" {
  description = "API key for Notion"
  default     = ""
}

data "local_file" "lambda_zip" {
  filename = "${path.module}/deployment_package.zip"
}

resource "aws_lambda_function" "todoist_lambda" {
  filename         = data.local_file.lambda_zip.filename
  function_name    = "todoist_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "getTodoist.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.12"
  source_code_hash = filebase64sha256(data.local_file.lambda_zip.filename)
  environment {
    variables = {
      TODOIST_API_KEY = var.TODOIST_API_TOKEN
      S3_BUCKET_NAME  = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}

resource "aws_lambda_function" "chatgpt_lambda" {
  filename         = data.local_file.lambda_zip.filename
  function_name    = "ChatGPT_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "putChatGPT.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.12"
  timeout          = 15
  source_code_hash = filebase64sha256(data.local_file.lambda_zip.filename)
  environment {
    variables = {
      OPEN_AI_KEY = var.OPEN_AI_KEY
      S3_BUCKET_NAME = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}

resource "aws_lambda_function" "notion_lambda" {
  filename         = data.local_file.lambda_zip.filename
  function_name    = "notion_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "putNotion.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.12"
  source_code_hash = filebase64sha256(data.local_file.lambda_zip.filename)
  environment {
    variables = {
      NOTION_API_TOKEN   = var.NOTION_API_TOKEN
      S3_BUCKET_NAME = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}
