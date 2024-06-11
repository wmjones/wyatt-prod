import json
import os
from notion_client import Client


def lambda_handler(event, context):
    notion_token = os.environ["NOTION_TOKEN"]
    print(f"notion_token: {notion_token}")
    notion = Client(auth=notion_token)

    # Parse the incoming request data
    # body = json.loads(event["body"])
    # task_name = body["task_name"]
    # task_description = body["task_description"]

    # Create a new task in the Notion Kanban board
    new_page = notion.pages.create(
        parent={"database_id": "c8a2c83ac85b4fe08b36bf631604f017"},
        properties={"Name": {"type": "title", "title": [{"type": "text", "text": {"content": "Tomatoes"}}]}},
    )

    return {"statusCode": 200, "body": json.dumps({"message": "Task created successfully!", "task_id": new_page["id"]})}


if __name__ == "__main__":
    # For testing purposes, you can pass a sample event with content
    sample_event = {
        "body": json.dumps({"Team": "Todoist", "task_description": "Sample description", "task_name": "Sample task"})
    }
    lambda_handler(sample_event, None)
