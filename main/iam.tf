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

resource "aws_iam_role" "scheduler" {
  name = "scheduler-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = ["scheduler.amazonaws.com"]
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "scheduler" {
  policy_arn = aws_iam_policy.scheduler.arn
  role       = aws_iam_role.scheduler.name
}

resource "aws_iam_policy" "scheduler" {
  name = "scheduler-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # allow scheduler to execute the task
        Effect = "Allow",
        Action = [
          "ecs:RunTask"
        ]
        # trim :<revision> from arn, to point at the whole task definition and not just one revision
        Resource = [trimsuffix(aws_ecs_task_definition.task.arn, ":${aws_ecs_task_definition.task.revision}")]
      },
      { # allow scheduler to set the IAM roles of your task
        Effect = "Allow",
        Action = [
          "iam:PassRole"
        ]
        Resource = [aws_iam_role.task.arn, aws_iam_role.execution.arn]
      },
    ]
  })
}