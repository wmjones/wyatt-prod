resource "aws_iam_role" "lambda_role" {
  name = "lambda_exec_role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com",
      },
    }],
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name   = "lambda_policy"
  role   = aws_iam_role.lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
        ],
        Effect   = "Allow",
        Resource = "${aws_s3_bucket.data.arn}/*",
      },
      {
        Action = "logs:*",
        Effect = "Allow",
        Resource = "*"
      }
    ],
  })
}