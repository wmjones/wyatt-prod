resource "aws_sfn_state_machine" "step_function" {
  name     = "TodoistStepFunction"
  role_arn = aws_iam_role.lambda_role.arn
  definition = jsonencode({
    Comment : "A description of my state machine",
    StartAt : "GetIncompleteTasks",
    States : {
      GetIncompleteTasks : {
        Type : "Task",
        Resource : aws_lambda_function.todoist_lambda.arn,
        Next : "PutChatGPT"
      },
      PutChatGPT : {
        Type : "Task",
        Resource : aws_lambda_function.chatgpt_lambda.arn,
        Next : "PutNotion"
      },
      PutNotion : {
        Type : "Task",
        Resource : aws_lambda_function.notion_lambda.arn,
        Next : "PutTodoist"
      },
      PutTodoist : {
        Type : "Task",
        Resource : aws_lambda_function.put_todoist_lambda.arn,
        End : true
      }
    }
  })
}
