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
        End : true
      }
    }
  })
}
