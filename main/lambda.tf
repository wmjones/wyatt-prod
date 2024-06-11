variable "TODOIST_API_TOKEN" {
  description = "API key for Todoist"
  default     = ""
}

variable "OPENAI_API_KEY" {
  description = "API key for ChatGPT"
  default     = ""
}

variable "NOTION_TOKEN" {
  description = "API key for Notion"
  default     = ""
}

data "local_file" "lambda_zip" {
  filename = "${path.module}/artifact/deployment_package.zip"
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
  source_code_hash = filebase64sha256(data.local_file.lambda_zip.filename)
  environment {
    variables = {
      OPENAI_API_KEY = var.OPENAI_API_KEY
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
      NOTION_TOKEN   = var.NOTION_TOKEN
      S3_BUCKET_NAME = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}
