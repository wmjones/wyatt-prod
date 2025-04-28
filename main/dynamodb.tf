module "visualization_table" {
  source = "./modules/dynamodb"

  table_name = "${var.project_name}-visualizations-${terraform.workspace}"
  hash_key   = "userId"
  range_key  = "visualizationId"

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

  billing_mode = "PAY_PER_REQUEST"

  # Enable point-in-time recovery
  enable_point_in_time_recovery = true

  # Auto-scaling settings
  autoscaling_enabled            = false
  autoscaling_read_max_capacity  = 100
  autoscaling_write_max_capacity = 100

  tags = {
    Component = "D3 Dashboard"
    Name      = "Visualization Table"
  }
}
