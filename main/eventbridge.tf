resource "aws_scheduler_schedule" "step_function_schedule" {
  name                = "run-step-function-every-5-minutes"
  schedule_expression = "rate(15 minutes)"
  flexible_time_window {
    mode = "OFF"
  }
  target {
    arn      = aws_sfn_state_machine.step_function.arn # Corrected reference to the state machine ARN
    role_arn = aws_iam_role.sfn_role.arn
    input = jsonencode({
    })
  }
}