import json
from notion_client import Client
from utils import get_secret, SuperTask, tasks_to_json
from dataclasses import asdict


def lambda_handler(event, context):
    print(f"event: {event}")
    secret = get_secret("notion_token", "us-east-2")
    secret_dict = json.loads(secret)
    notion_token = secret_dict["NOTION_API_TOKEN"]
    notion = Client(auth=notion_token)

    list_task_dict = []
    for json_task in json.loads(event["body"]):
        print(f"\njson_task: {json_task}")
        task = SuperTask(**json_task)
        # Create a new task in the Notion Kanban board
        try:
            notion.pages.create(
                parent={"database_id": "c8a2c83ac85b4fe08b36bf631604f017"},
                properties={"title": {"title": [{"type": "text", "text": {"content": task.content}}]}},
                children=[
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {"rich_text": [{"type": "text", "text": {"content": task.agent_output}}]},
                    }
                ],
            )
            list_task_dict.append(task)
        except Exception as error:
            return {"statusCode": 500, "body": json.dumps({"error": str(error)})}

    return {"statusCode": 200, "body": tasks_to_json(list_task_dict)}


if __name__ == "__main__":
    lambda_handler(None, None)
