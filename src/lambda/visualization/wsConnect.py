import boto3
import os
import time
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
connection_table = dynamodb.Table(os.environ.get("CONNECTION_TABLE"))


def lambda_handler(event, context):
    """Handle WebSocket connect event"""
    connection_id = event["requestContext"]["connectionId"]

    try:
        # Store connection ID with TTL (24 hours)
        ttl = int(time.time()) + 86400

        connection_table.put_item(Item={"connectionId": connection_id, "timestamp": int(time.time() * 1000), "ttl": ttl})

        return {"statusCode": 200, "body": "Connected"}
    except Exception as e:
        logger.error(f"Error handling WebSocket connect: {str(e)}")
        return {"statusCode": 500, "body": str(e)}
