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
      S3_BUCKET_NAME = aws_s3_bucket.wyatt-datalake-35315550.bucket
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
  timeout          = 10
  source_code_hash = filebase64sha256(data.local_file.lambda_zip.filename)
  environment {
    variables = {
      S3_BUCKET_NAME = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}

// add a lambda for putTodoist
resource "aws_lambda_function" "put_todoist_lambda" {
  filename         = data.local_file.lambda_zip.filename
  function_name    = "put_todoist_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "putTodoist.lambda_handler" # Update the handler to the correct module and function name
  runtime          = "python3.12"
  source_code_hash = filebase64sha256(data.local_file.lambda_zip.filename)
  environment {
    variables = {
      S3_BUCKET_NAME = aws_s3_bucket.wyatt-datalake-35315550.bucket
    }
  }
}