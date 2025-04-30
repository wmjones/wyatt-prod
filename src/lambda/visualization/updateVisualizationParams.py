import json
import boto3
import time
import os
import logging
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
parameter_table = dynamodb.Table(os.environ.get("PARAMETER_TABLE"))
history_table = dynamodb.Table(os.environ.get("HISTORY_TABLE"))
connection_table = dynamodb.Table(os.environ.get("CONNECTION_TABLE"))

# Optional: WebSocket API client for real-time updates (implemented later)
apigw_management = None
if os.environ.get("WEBSOCKET_API_ENDPOINT"):
    endpoint = os.environ.get("WEBSOCKET_API_ENDPOINT")
    apigw_management = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)


def lambda_handler(event, context):
    """
    Updates normal distribution parameters and records the change history.
    Optionally broadcasts updates to connected clients via WebSocket.
    """
    # Extract user information from Cognito authorizer
    request_context = event.get("requestContext", {})
    authorizer = request_context.get("authorizer", {})
    claims = authorizer.get("claims", {})

    user_id = claims.get("sub", "anonymous")
    user_email = claims.get("email", "anonymous@example.com")

    # Parse request body
    body = json.loads(event.get("body", "{}"))
    new_mean = body.get("mean")
    new_std_dev = body.get("stdDev")

    # Validate input parameters
    if new_mean is None or new_std_dev is None:
        return {"statusCode": 400, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps({"error": "Missing required parameters: mean and stdDev"})}

    if new_std_dev <= 0:
        return {"statusCode": 400, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps({"error": "Standard deviation must be positive"})}

    try:
        # Get current params for history tracking
        current_params = parameter_table.query(KeyConditionExpression=Key("paramId").eq("normal_distribution_params"), Limit=1, ScanIndexForward=False)

        current_mean = 0
        current_std_dev = 1

        if current_params.get("Items"):
            current_mean = current_params["Items"][0].get("mean", 0)
            current_std_dev = current_params["Items"][0].get("stdDev", 1)

        timestamp = int(time.time() * 1000)  # Milliseconds since epoch

        # Update the parameters
        parameter_table.put_item(Item={"paramId": "normal_distribution_params", "timestamp": timestamp, "mean": new_mean, "stdDev": new_std_dev, "lastUpdatedBy": user_email, "userId": user_id, "lastUpdatedAt": timestamp})

        # Record change history
        if new_mean != current_mean:
            history_table.put_item(Item={"userId": user_id, "timestamp": timestamp, "paramName": "mean", "oldValue": current_mean, "newValue": new_mean, "userEmail": user_email})

        if new_std_dev != current_std_dev:
            history_table.put_item(Item={"userId": user_id, "timestamp": timestamp + 1, "paramName": "stdDev", "oldValue": current_std_dev, "newValue": new_std_dev, "userEmail": user_email})  # Ensure unique timestamp

        # Broadcast to all connected clients if WebSocket API is configured
        if apigw_management:
            broadcast_params_update(new_mean, new_std_dev, user_email)

        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps({"success": True, "timestamp": timestamp})}

    except Exception as e:
        logger.error(f"Error updating parameters: {str(e)}")
        return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps({"error": str(e)})}


def broadcast_params_update(mean, std_dev, updated_by):
    """Broadcast parameter updates to all connected WebSocket clients"""
    if not apigw_management:
        return

    try:
        # Get all connection IDs
        response = connection_table.scan(ProjectionExpression="connectionId")

        message = json.dumps({"type": "PARAMS_UPDATE", "data": {"mean": mean, "stdDev": std_dev, "updatedBy": updated_by}})

        # Send to each connection
        for item in response.get("Items", []):
            connection_id = item["connectionId"]
            try:
                apigw_management.post_to_connection(ConnectionId=connection_id, Data=message)
            except Exception as e:
                # Connection is no longer valid, delete it
                if "GoneException" in str(e):
                    connection_table.delete_item(Key={"connectionId": connection_id})
                else:
                    logger.error(f"Error posting to connection {connection_id}: {str(e)}")

    except Exception as e:
        logger.error(f"Error broadcasting update: {str(e)}")
