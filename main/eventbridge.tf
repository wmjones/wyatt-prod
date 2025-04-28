# Create the EventBridge rule directly
resource "aws_cloudwatch_event_rule" "todoist_workflow" {
  name                = "todoist-workflow-rule"
  description         = "Run the Todoist workflow on a schedule"
  schedule_expression = "rate(15 minutes)"

  tags = {
    Component = "Productivity System"
    Name      = "EventBridge Scheduler"
  }
}

# Create the EventBridge target with explicit role_arn
resource "aws_cloudwatch_event_target" "todoist_workflow" {
  rule      = aws_cloudwatch_event_rule.todoist_workflow.name
  target_id = "trigger-todoist-workflow"
  arn       = module.todoist_workflow.state_machine_arn
  role_arn  = aws_iam_role.eventbridge_role.arn

  input_transformer {
    input_paths = {
      time = "$.time"
    }
    input_template = jsonencode({
      time   = "<time>",
      source = "aws.events"
    })
  }
}
