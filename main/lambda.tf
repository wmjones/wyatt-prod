resource "aws_lambda_function" "todoist_lambda" {
  filename         = "lambda_function.zip"
  function_name    = "todoist_lambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda_function.handler"
  runtime          = "python3.8"
  source_code_hash = filebase64sha256("getTodoist.py.zip")

  environment {
    variables = {
      TODOIST_API_KEY = "9593c48930e891084fde61fa56a7a5c59336535e"
      S3_BUCKET_NAME  = aws_s3_bucket.data.bucket
    }
  }
}