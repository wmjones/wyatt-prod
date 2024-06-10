import json
import os
from todoist_api_python.api import TodoistAPI
import boto3

from dataclasses import dataclass, asdict


@dataclass
class Task:
    assignee_id: str
    assigner_id: str
    comment_count: int
    is_completed: bool
    content: str
    created_at: str
    creator_id: str
    description: str
    due: dict
    id: str
    labels: list
    order: int
    parent_id: str
    priority: int
    project_id: str
    section_id: str
    url: str
    duration: str
    sync_id: str


def task_to_dict(task):
    return asdict(task)


def task_to_json(task):
    task_dict = task_to_dict(task)
    return json.dumps(task_dict, indent=4)


def lambda_handler(event, context):
    # todoist_api_key = os.environ["TODOIST_API_KEY"]
    todoist_api_key = "9593c48930e891084fde61fa56a7a5c59336535e"
    s3_bucket_name = os.environ["S3_BUCKET_NAME"]
    api = TodoistAPI(todoist_api_key)

    try:
        tasks = api.get_tasks()
        parsed_tasks = [task_to_json(tasks[i]) for i in range(len(tasks))]

        s3 = boto3.client("s3")
        s3.put_object(
            Bucket=s3_bucket_name,
            Key="data/incomplete_tasks.json",
            Body=json.dumps(parsed_tasks),
            ContentType="application/json",
        )
    except Exception as error:
        print(error)

    return {"statusCode": 200, "body": json.dumps("Data saved to S3")}


if __name__ == "__main__":
    lambda_handler(None, None)
