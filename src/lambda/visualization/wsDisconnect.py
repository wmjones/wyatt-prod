import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
connection_table = dynamodb.Table(os.environ.get("CONNECTION_TABLE"))


def lambda_handler(event, context):
    """Handle WebSocket disconnect event"""
    connection_id = event["requestContext"]["connectionId"]

    try:
        # Remove connection ID
        connection_table.delete_item(Key={"connectionId": connection_id})

        return {"statusCode": 200, "body": "Disconnected"}
    except Exception as e:
        logger.error(f"Error handling WebSocket disconnect: {str(e)}")
        return {"statusCode": 500, "body": str(e)}
