import json
import os
from notion_client import Client


def lambda_handler(event, context):
    notion_token = os.environ["NOTION_API_TOKEN"]
    notion = Client(auth=notion_token)

    # Parse the incoming request data
    # body = json.loads(event["body"])
    # task_name = body["task_name"]
    # task_description = body["task_description"]

    # Create a new task in the Notion Kanban board
    try:
        new_page = notion.pages.create(
            parent={"database_id": "c8a2c83ac85b4fe08b36bf631604f017"},
            properties={"Name": {"type": "title", "title": [{"type": "text", "text": {"content": "Tomatoes"}}]}},
        )
    except Exception as error:
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}

    return {"statusCode": 200, "body": json.dumps({"message": "Task created successfully!", "task_id": new_page["id"]})}
