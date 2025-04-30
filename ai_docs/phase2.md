# Normal Distribution Dashboard - Implementation Phase 1

I'll implement the first stage of our plan, focusing on completing the backend infrastructure and adding a "Hello World" test to verify everything is working correctly.

## Part 1: Backend Lambda Functions

Let's start by implementing the key Lambda functions needed for our visualization backend:

### 1. Get Visualization Data Lambda Function

```python
# getVisualizationData.py
import json
import boto3
import os
from boto3.dynamodb.conditions import Key
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
parameter_table = dynamodb.Table(os.environ.get('PARAMETER_TABLE'))

def lambda_handler(event, context):
    """
    Retrieves the current normal distribution parameters.
    Returns default values if no parameters exist.
    """
    try:
        # Get current visualization parameters
        response = parameter_table.query(
            KeyConditionExpression=Key('paramId').eq('normal_distribution_params'),
            Limit=1,
            ScanIndexForward=False  # Get the most recent
        )

        # Default values if no custom parameters exist
        if not response.get('Items'):
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'mean': 0,
                    'stdDev': 1,
                    'lastUpdatedBy': None,
                    'lastUpdatedAt': None
                })
            }

        # Return the current parameters
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(response['Items'][0])
        }

    except Exception as e:
        logger.error(f"Error getting visualization data: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e)})
        }
```

### 2. Update Visualization Parameters Lambda Function

```python
# updateVisualizationParams.py
import json
import boto3
import time
import os
import logging
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
parameter_table = dynamodb.Table(os.environ.get('PARAMETER_TABLE'))
history_table = dynamodb.Table(os.environ.get('HISTORY_TABLE'))
connection_table = dynamodb.Table(os.environ.get('CONNECTION_TABLE'))

# Optional: WebSocket API client for real-time updates (implemented later)
apigw_management = None
if os.environ.get('WEBSOCKET_API_ENDPOINT'):
    endpoint = os.environ.get('WEBSOCKET_API_ENDPOINT')
    apigw_management = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint)

def lambda_handler(event, context):
    """
    Updates normal distribution parameters and records the change history.
    Optionally broadcasts updates to connected clients via WebSocket.
    """
    # Extract user information from Cognito authorizer
    request_context = event.get('requestContext', {})
    authorizer = request_context.get('authorizer', {})
    claims = authorizer.get('claims', {})

    user_id = claims.get('sub', 'anonymous')
    user_email = claims.get('email', 'anonymous@example.com')

    # Parse request body
    body = json.loads(event.get('body', '{}'))
    new_mean = body.get('mean')
    new_std_dev = body.get('stdDev')

    # Validate input parameters
    if new_mean is None or new_std_dev is None:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Missing required parameters: mean and stdDev'})
        }

    if new_std_dev <= 0:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Standard deviation must be positive'})
        }

    try:
        # Get current params for history tracking
        current_params = parameter_table.query(
            KeyConditionExpression=Key('paramId').eq('normal_distribution_params'),
            Limit=1,
            ScanIndexForward=False
        )

        current_mean = 0
        current_std_dev = 1

        if current_params.get('Items'):
            current_mean = current_params['Items'][0].get('mean', 0)
            current_std_dev = current_params['Items'][0].get('stdDev', 1)

        timestamp = int(time.time() * 1000)  # Milliseconds since epoch

        # Update the parameters
        parameter_table.put_item(
            Item={
                'paramId': 'normal_distribution_params',
                'timestamp': timestamp,
                'mean': new_mean,
                'stdDev': new_std_dev,
                'lastUpdatedBy': user_email,
                'userId': user_id,
                'lastUpdatedAt': timestamp
            }
        )

        # Record change history
        if new_mean != current_mean:
            history_table.put_item(
                Item={
                    'userId': user_id,
                    'timestamp': timestamp,
                    'paramName': 'mean',
                    'oldValue': current_mean,
                    'newValue': new_mean,
                    'userEmail': user_email
                }
            )

        if new_std_dev != current_std_dev:
            history_table.put_item(
                Item={
                    'userId': user_id,
                    'timestamp': timestamp + 1,  # Ensure unique timestamp
                    'paramName': 'stdDev',
                    'oldValue': current_std_dev,
                    'newValue': new_std_dev,
                    'userEmail': user_email
                }
            )

        # Broadcast to all connected clients if WebSocket API is configured
        if apigw_management:
            broadcast_params_update(new_mean, new_std_dev, user_email)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'timestamp': timestamp
            })
        }

    except Exception as e:
        logger.error(f"Error updating parameters: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e)})
        }

def broadcast_params_update(mean, std_dev, updated_by):
    """Broadcast parameter updates to all connected WebSocket clients"""
    if not apigw_management:
        return

    try:
        # Get all connection IDs
        response = connection_table.scan(ProjectionExpression='connectionId')

        message = json.dumps({
            'type': 'PARAMS_UPDATE',
            'data': {
                'mean': mean,
                'stdDev': std_dev,
                'updatedBy': updated_by
            }
        })

        # Send to each connection
        for item in response.get('Items', []):
            connection_id = item['connectionId']
            try:
                apigw_management.post_to_connection(
                    ConnectionId=connection_id,
                    Data=message
                )
            except Exception as e:
                # Connection is no longer valid, delete it
                if 'GoneException' in str(e):
                    connection_table.delete_item(
                        Key={'connectionId': connection_id}
                    )
                else:
                    logger.error(f"Error posting to connection {connection_id}: {str(e)}")

    except Exception as e:
        logger.error(f"Error broadcasting update: {str(e)}")
```

### 3. WebSocket Handler Lambda Functions

```python
# wsConnect.py
import json
import boto3
import os
import time
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
connection_table = dynamodb.Table(os.environ.get('CONNECTION_TABLE'))

def lambda_handler(event, context):
    """Handle WebSocket connect event"""
    connection_id = event['requestContext']['connectionId']

    try:
        # Store connection ID with TTL (24 hours)
        ttl = int(time.time()) + 86400

        connection_table.put_item(
            Item={
                'connectionId': connection_id,
                'timestamp': int(time.time() * 1000),
                'ttl': ttl
            }
        )

        return {'statusCode': 200, 'body': 'Connected'}
    except Exception as e:
        logger.error(f"Error handling WebSocket connect: {str(e)}")
        return {'statusCode': 500, 'body': str(e)}
```

```python
# wsDisconnect.py
import json
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
connection_table = dynamodb.Table(os.environ.get('CONNECTION_TABLE'))

def lambda_handler(event, context):
    """Handle WebSocket disconnect event"""
    connection_id = event['requestContext']['connectionId']

    try:
        # Remove connection ID
        connection_table.delete_item(
            Key={
                'connectionId': connection_id
            }
        )

        return {'statusCode': 200, 'body': 'Disconnected'}
    except Exception as e:
        logger.error(f"Error handling WebSocket disconnect: {str(e)}")
        return {'statusCode': 500, 'body': str(e)}
```

## Part 2: DynamoDB Table Definitions

Now let's update our DynamoDB tables to support the visualization data:

```hcl
# Add to your dynamodb.tf file

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
```

## Part 3: WebSocket API Gateway Configuration

Let's add a WebSocket API Gateway for real-time updates:

```hcl
# Create a new file: websocket_api.tf

# WebSocket API Gateway
resource "aws_apigatewayv2_api" "websocket" {
  name                       = "${var.project_name}-websocket-api-${terraform.workspace}"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

# Stage for WebSocket API
resource "aws_apigatewayv2_stage" "websocket" {
  api_id      = aws_apigatewayv2_api.websocket.id
  name        = "production"
  auto_deploy = true
}

# Connect route
resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.connect.id}"
}

# Disconnect route
resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.disconnect.id}"
}

# Connect integration
resource "aws_apigatewayv2_integration" "connect" {
  api_id             = aws_apigatewayv2_api.websocket.id
  integration_type   = "AWS_PROXY"
  integration_uri    = module.ws_connect_lambda.function_invoke_arn
  integration_method = "POST"
}

# Disconnect integration
resource "aws_apigatewayv2_integration" "disconnect" {
  api_id             = aws_apigatewayv2_api.websocket.id
  integration_type   = "AWS_PROXY"
  integration_uri    = module.ws_disconnect_lambda.function_invoke_arn
  integration_method = "POST"
}

# Lambda permissions for WebSocket API
resource "aws_lambda_permission" "websocket_connect" {
  statement_id  = "AllowExecutionFromWebSocketAPI"
  action        = "lambda:InvokeFunction"
  function_name = module.ws_connect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket.execution_arn}/*/*"
}

resource "aws_lambda_permission" "websocket_disconnect" {
  statement_id  = "AllowExecutionFromWebSocketAPI"
  action        = "lambda:InvokeFunction"
  function_name = module.ws_disconnect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket.execution_arn}/*/*"
}
```

## Part 4: Lambda Function Definitions

Let's define our Lambda functions in the Terraform configuration:

```hcl
# Add to your lambda.tf file

# Get visualization data Lambda
module "get_visualization_lambda" {
  source = "./modules/lambda_function"

  function_name = "${var.project_name}-get-visualization-${terraform.workspace}"
  description   = "Lambda function to get normal distribution parameters"
  handler       = "getVisualizationData.lambda_handler"
  runtime       = "python3.12"
  timeout       = 10
  zip_file      = local.lambda_zip_path

  environment_variables = {
    PARAMETER_TABLE = module.parameter_table.table_id
  }

  policy_statements = {
    dynamodb = {
      effect  = "Allow"
      actions = ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem"]
      resources = [
        module.parameter_table.table_arn
      ]
    },
    logs = {
      effect    = "Allow"
      actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
      resources = ["arn:aws:logs:*:*:*"]
    }
  }

  tags = {
    Component = "D3 Dashboard"
    Function  = "Get Visualization Data"
  }
}

# Update visualization data Lambda
module "update_visualization_lambda" {
  source = "./modules/lambda_function"

  function_name = "${var.project_name}-update-visualization-${terraform.workspace}"
  description   = "Lambda function to update normal distribution parameters"
  handler       = "updateVisualizationParams.lambda_handler"
  runtime       = "python3.12"
  timeout       = 10
  zip_file      = local.lambda_zip_path

  environment_variables = {
    PARAMETER_TABLE       = module.parameter_table.table_id
    HISTORY_TABLE         = module.history_table.table_id
    CONNECTION_TABLE      = module.connection_table.table_id
    WEBSOCKET_API_ENDPOINT = aws_apigatewayv2_stage.websocket.invoke_url
  }

  policy_statements = {
    dynamodb = {
      effect  = "Allow"
      actions = ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:PutItem"]
      resources = [
        module.parameter_table.table_arn,
        module.history_table.table_arn,
        module.connection_table.table_arn
      ]
    },
    websocket = {
      effect  = "Allow"
      actions = ["execute-api:ManageConnections"]
      resources = ["${aws_apigatewayv2_api.websocket.execution_arn}/*"]
    },
    logs = {
      effect    = "Allow"
      actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
      resources = ["arn:aws:logs:*:*:*"]
    }
  }

  tags = {
    Component = "D3 Dashboard"
    Function  = "Update Visualization Data"
  }
}

# WebSocket Connect Lambda
module "ws_connect_lambda" {
  source = "./modules/lambda_function"

  function_name = "${var.project_name}-ws-connect-${terraform.workspace}"
  description   = "Lambda function to handle WebSocket connections"
  handler       = "wsConnect.lambda_handler"
  runtime       = "python3.12"
  timeout       = 10
  zip_file      = local.lambda_zip_path

  environment_variables = {
    CONNECTION_TABLE = module.connection_table.table_id
  }

  policy_statements = {
    dynamodb = {
      effect  = "Allow"
      actions = ["dynamodb:PutItem"]
      resources = [
        module.connection_table.table_arn
      ]
    },
    logs = {
      effect    = "Allow"
      actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
      resources = ["arn:aws:logs:*:*:*"]
    }
  }

  tags = {
    Component = "D3 Dashboard"
    Function  = "WebSocket Connect"
  }
}

# WebSocket Disconnect Lambda
module "ws_disconnect_lambda" {
  source = "./modules/lambda_function"

  function_name = "${var.project_name}-ws-disconnect-${terraform.workspace}"
  description   = "Lambda function to handle WebSocket disconnections"
  handler       = "wsDisconnect.lambda_handler"
  runtime       = "python3.12"
  timeout       = 10
  zip_file      = local.lambda_zip_path

  environment_variables = {
    CONNECTION_TABLE = module.connection_table.table_id
  }

  policy_statements = {
    dynamodb = {
      effect  = "Allow"
      actions = ["dynamodb:DeleteItem"]
      resources = [
        module.connection_table.table_arn
      ]
    },
    logs = {
      effect    = "Allow"
      actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
      resources = ["arn:aws:logs:*:*:*"]
    }
  }

  tags = {
    Component = "D3 Dashboard"
    Function  = "WebSocket Disconnect"
  }
}
```

## Part 5: API Gateway Configuration

Now let's update our API Gateway configuration to include the visualization endpoints:

```hcl
# Add to your api_gateway.tf file

# Update the integrations map in your API Gateway module
module "api_gateway" {
  # ...existing configuration...

  integrations = {
    # Existing integrations...

    "GET /api/normal-distribution" = {
      integration_uri        = module.get_visualization_lambda.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    },

    "POST /api/normal-distribution" = {
      integration_uri        = module.update_visualization_lambda.function_invoke_arn
      integration_type       = "AWS_PROXY"
      payload_format_version = "2.0"
      timeout_milliseconds   = 10000
    }
  }
}

# Add Lambda permissions for API Gateway
resource "aws_lambda_permission" "api_gateway_get_visualization" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.get_visualization_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api_gateway.api_execution_arn}/*"
}

resource "aws_lambda_permission" "api_gateway_update_visualization" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.update_visualization_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api_gateway.api_execution_arn}/*"
}
```

## Part 6: Hello World Test

Finally, let's create a simple "Hello World" React app to verify our infrastructure is working:

## Implementation Summary

I've implemented the first stage of our plan for the D3 Normal Distribution Dashboard project, focusing on setting up the backend infrastructure and creating a simple "Hello World" test to verify everything works correctly.

### 1. Backend Lambda Functions

I've created four Lambda functions to handle our application logic:

1. **getVisualizationData.py**: Retrieves current normal distribution parameters from DynamoDB.
2. **updateVisualizationParams.py**: Updates parameters, records change history, and broadcasts updates.
3. **wsConnect.py**: Handles WebSocket connection establishment.
4. **wsDisconnect.py**: Manages WebSocket disconnections.

These functions follow PEP8 style guidelines as preferred, use boto3 for interacting with DynamoDB, and implement proper error handling.

### 2. DynamoDB Tables

I've defined three DynamoDB tables to support our application:

1. **Parameter Table**: Stores current normal distribution parameters.
2. **History Table**: Records parameter change history with user details.
3. **Connection Table**: Manages active WebSocket connections.

These tables follow NoSQL best practices with appropriate partition and sort keys, plus a secondary index for querying parameter change history.

### 3. API Gateway Configuration

I've configured two API Gateways:

1. **HTTP API Gateway**: For REST API endpoints to get/update normal distribution parameters.
2. **WebSocket API Gateway**: For real-time updates when parameters change.

Both gateways are properly integrated with Lambda functions and have appropriate permissions.

### 4. "Hello World" Test Application

I've created a React application to verify our infrastructure is working correctly. The app includes:

1. **Authentication**: Uses Amplify to integrate with Cognito for login/logout.
2. **API Testing**: Tests connection to the backend API endpoint.
3. **User Interface**: Provides feedback on authentication and API status.

### Frontend Files Created:

1. **Hello World Test App**: Main React application component
2. **App Styles**: CSS styling for the test application
3. **Vite Configuration**: Setup for the React build system
4. **Package.json**: Dependencies and scripts configuration
5. **Environment Variables Template**: Configuration for AWS resources
6. **Frontend Deployment Script**: Script to build and deploy to S3

## Next Steps

1. **Test Infrastructure Deployment**:
   - Deploy the Terraform infrastructure
   - Create a Cognito user for testing
   - Verify API endpoints are accessible

2. **Setup Frontend**:
   - Create the `.env` file from the template
   - Install dependencies with `npm install`
   - Test the application locally with `npm run dev`
   - Deploy to S3 with `npm run deploy`

3. **Implement Normal Distribution Visualization**:
   - Create the D3.js visualization component
   - Implement interactive controls
   - Connect to real-time updates via WebSocket

This implementation provides a solid foundation for the normal distribution visualization dashboard, with real-time updates and change tracking as specified in your requirements.
