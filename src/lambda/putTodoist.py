import requests
from utils import get_secret


def lambda_handler(event, context):
    task = json.loads(event["body"])
    secret = get_secret("todoist_key", "us-east-2")
    secret_dict = json.loads(secret)
    todoist_api_key = secret_dict["TODOIST_API_KEY"]
    headers = {"Authorization": f"Bearer {todoist_api_key}"}

    response = requests.delete(f'https://api.todoist.com/rest/v1/tasks/{task["id"]}', headers=headers)

    return {"statusCode": response.status_code, "body": json.dumps({"message": "Task deleted"})}
