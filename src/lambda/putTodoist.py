import requests
from utils import get_secret, SuperTask
import json


def lambda_handler(event, context):
    task = json.loads(event["body"])
    secret = get_secret("todoist_key", "us-east-2")
    secret_dict = json.loads(secret)
    todoist_api_key = secret_dict["TODOIST_API_KEY"]
    headers = {"Authorization": f"Bearer {todoist_api_key}"}

    for json_task in json.loads(event["body"]):
        try:
            print(f"\njson_task: {json_task}")
            task = SuperTask(**json_task)
            response = requests.delete(f'https://api.todoist.com/rest/v1/tasks/{task.id}', headers=headers)
        except Exception as error:
            return {"statusCode": 500, "body": json.dumps({"error": str(error)})}
    return {"statusCode": response.status_code, "body": json.dumps({"message": "Task deleted"})}
