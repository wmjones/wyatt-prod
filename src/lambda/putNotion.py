import json
import os
from notion_client import Client
import boto3
from botocore.exceptions import ClientError


def get_secret(secret_name, region_name):
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    return get_secret_value_response['SecretString']


def lambda_handler(event, context):
    secret = get_secret("notion_token", "us-east-2")
    secret_dict = json.loads(secret)
    print(secret_dict)
    notion_token = secret_dict['NOTION_API_TOKEN']
    notion = Client(auth=notion_token)

    print(event)
    # Parse the incoming request data
    # body = json.loads(event["body"])
    # task_name = body["task_name"]
    # task_description = body["task_description"]

    # Create a new task in the Notion Kanban board
    try:
        new_page = notion.pages.create(
            parent={"database_id": "c8a2c83ac85b4fe08b36bf631604f017"},
            properties={
                "title": {
                "title": [{ "type": "text", "text": { "content": "Testing" } }]
                }
	        },
	        children=[
                {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{ "type": "text", "text": { "content": event['body'] } }]}
                }
            ],
        )
    except Exception as error:
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}

    return {"statusCode": 200, "body": json.dumps({"message": "Task created successfully!", "task_id": new_page["id"]})}


if __name__ == "__main__":
    lambda_handler(None, None)