import json
import boto3
import os
from boto3.dynamodb.conditions import Key
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
parameter_table = dynamodb.Table(os.environ.get("PARAMETER_TABLE"))


def lambda_handler(event, context):
    """
    Retrieves the current normal distribution parameters.
    Returns default values if no parameters exist.
    """
    try:
        # Get current visualization parameters
        response = parameter_table.query(KeyConditionExpression=Key("paramId").eq("normal_distribution_params"), Limit=1, ScanIndexForward=False)  # Get the most recent

        # Default values if no custom parameters exist
        if not response.get("Items"):
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps({"mean": 0, "stdDev": 1, "lastUpdatedBy": None, "lastUpdatedAt": None})}

        # Return the current parameters
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps(response["Items"][0])}

    except Exception as e:
        logger.error(f"Error getting visualization data: {str(e)}")
        return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}, "body": json.dumps({"error": str(e)})}
