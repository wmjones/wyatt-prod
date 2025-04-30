# DynamoDB tables for the Normal Distribution Visualization Dashboard

# Normal distribution parameters table
module "parameter_table" {
  source = "./modules/dynamodb"

  table_name = "${var.project_name}-parameters-${terraform.workspace}"
  hash_key   = "paramId"
  range_key  = "timestamp"

  attributes = [
    {
      name = "paramId"
      type = "S"
    },
    {
      name = "timestamp"
      type = "N"
    }
  ]

  billing_mode = "PAY_PER_REQUEST"

  tags = {
    Component = "D3 Dashboard"
    Name      = "Parameter Table"
  }
}

# Parameter change history table
module "history_table" {
  source = "./modules/dynamodb"

  table_name = "${var.project_name}-parameter-history-${terraform.workspace}"
  hash_key   = "userId"
  range_key  = "timestamp"

  attributes = [
    {
      name = "userId"
      type = "S"
    },
    {
      name = "timestamp"
      type = "N"
    },
    {
      name = "paramName"
      type = "S"
    }
  ]

  global_secondary_indexes = [
    {
      name               = "ParamNameIndex"
      hash_key           = "paramName"
      range_key          = "timestamp"
      write_capacity     = 5
      read_capacity      = 5
      projection_type    = "ALL"
      non_key_attributes = []
    }
  ]

  billing_mode = "PAY_PER_REQUEST"

  tags = {
    Component = "D3 Dashboard"
    Name      = "Parameter History Table"
  }
}

# WebSocket connections table
module "connection_table" {
  source = "./modules/dynamodb"

  table_name = "${var.project_name}-connections-${terraform.workspace}"
  hash_key   = "connectionId"

  attributes = [
    {
      name = "connectionId"
      type = "S"
    }
  ]

  billing_mode = "PAY_PER_REQUEST"

  # TTL for auto-cleanup of stale connections
  enable_point_in_time_recovery = false

  tags = {
    Component = "D3 Dashboard"
    Name      = "WebSocket Connections Table"
  }
}
