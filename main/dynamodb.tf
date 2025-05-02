module "visualization_table" {
  source = "./modules/dynamodb"

  environment = var.environment
  table_name  = "${var.project_name}-visualizations-${var.environment}"
  hash_key    = "userId"
  range_key   = "visualizationId"

  attributes = [
    {
      name = "userId"
      type = "S"
    },
    {
      name = "visualizationId"
      type = "S"
    },
    {
      name = "createdAt"
      type = "N"
    }
  ]

  global_secondary_indexes = [
    {
      name               = "CreatedAtIndex"
      hash_key           = "userId"
      range_key          = "createdAt"
      write_capacity     = 5
      read_capacity      = 5
      projection_type    = "ALL"
      non_key_attributes = []
    }
  ]

  billing_mode = var.dynamodb_billing_mode

  # Enable point-in-time recovery
  enable_point_in_time_recovery = var.dynamodb_point_in_time_recovery

  # Auto-scaling settings
  autoscaling_enabled            = false
  autoscaling_read_max_capacity  = 100
  autoscaling_write_max_capacity = 100

  tags = {
    Component   = "D3 Dashboard"
    Name        = "Visualization Table"
    Environment = var.environment
  }
}
