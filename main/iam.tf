resource "aws_iam_role" "lambda_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com",
      },
      },
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "states.amazonaws.com",
        },
    }],
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
        ],
        Effect   = "Allow",
        Resource = "${aws_s3_bucket.wyatt-datalake-35315550.arn}/*",

      },
      {
        Action   = "logs:*",
        Effect   = "Allow",
        Resource = "*"
      },
      {
        Action   = "lambda:InvokeFunction",
        Effect   = "Allow",
        Resource = "${aws_lambda_function.todoist_lambda.arn}"
      },
      {
        Action   = "lambda:InvokeFunction",
        Effect   = "Allow",
        Resource = "${aws_lambda_function.chatgpt_lambda.arn}"
      },
      {
        Action   = "lambda:InvokeFunction",
        Effect   = "Allow",
        Resource = "${aws_lambda_function.notion_lambda.arn}"
      },
      {
        Action   = "lambda:InvokeFunction",
        Effect   = "Allow",
        Resource = "${aws_lambda_function.put_todoist_lambda.arn}"
      },
      {
        Action   = "secretsmanager:GetSecretValue",
        Effect   = "Allow",
        Resource = "*"
      }
    ],
  })
}

resource "aws_iam_role" "sfn_role" {
  name = "sfn_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "states.amazonaws.com"
        }
      },
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "events.amazonaws.com"
        }
      },
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          AWS = aws_iam_role.lambda_role.arn
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "sfn_policy" {
  name = "sfn_policy"
  role = aws_iam_role.sfn_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "states:StartExecution",
        Effect = "Allow",
        Resource = "*"
      },
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "*"
      },
      {
        Action   = "logs:CreateLogGroup",
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}