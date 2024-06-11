import json
import os
from todoist_api_python.api import TodoistAPI
import boto3
import re

from dataclasses import dataclass, asdict
from typing import List


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


def strip_rich_text(text: str) -> str:
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00010000-\U0010ffff"  # emoticons
        "]+",
        flags=re.UNICODE,
    )
    clean_text = emoji_pattern.sub(r"", text)
    clean_text = "testing"
    return clean_text


def task_to_dict(task: Task) -> dict:
    task.content = strip_rich_text(task.content)
    return asdict(task)


def tasks_to_json(tasks: List[Task]) -> str:
    tasks_dict = [task_to_dict(task) for task in tasks]
    return json.dumps(tasks_dict, indent=4)


def lambda_handler(event, context):
    todoist_api_key = os.environ["TODOIST_API_KEY"]
    print(f"todoist_api_key: {todoist_api_key}")
    s3_bucket_name = os.environ["S3_BUCKET_NAME"]
    api = TodoistAPI(todoist_api_key)

    try:
        tasks = api.get_tasks()
        json_str = tasks_to_json(tasks)

        s3 = boto3.client("s3")
        s3.put_object(Bucket=s3_bucket_name, Key="data/incomplete_tasks.json", Body=json_str)
    except Exception as error:
        print(error)

    return {"statusCode": 200, "body": json.dumps("Data saved to S3")}
