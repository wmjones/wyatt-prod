module "eventbridge_scheduler" {
  source  = "terraform-aws-modules/eventbridge/aws"
  version = "~> 1.0"

  create_bus = false

  rules = {
    todoist_workflow = {
      description         = "Run the Todoist workflow on a schedule"
      schedule_expression = "rate(15 minutes)"
    }
  }

  targets = {
    todoist_workflow = [
      {
        name     = "trigger-todoist-workflow"
        arn      = module.todoist_workflow.state_machine_arn
        role_arn = aws_iam_role.sfn_role.arn
        input_transformer = {
          input_paths = {
            time = "$.time"
          }
          input_template = jsonencode({
            time   = "<time>",
            source = "aws.events"
          })
        }
      }
    ]
  }

  tags = {
    Component = "Productivity System"
    Name      = "EventBridge Scheduler"
  }
}
