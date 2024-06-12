import json
import os
from todoist_api_python.api import TodoistAPI
import re

from dataclasses import dataclass, asdict
from typing import List

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
    tasks_dict = [task_to_dict(task) for task in tasks if task.project_id == '6VV7F2F6V4JjWJPr']
    return json.dumps(tasks_dict, indent=4)


def lambda_handler(event, context):
    secret = get_secret("todoist_key", "us-east-2")
    secret_dict = json.loads(secret)
    todoist_api_key = secret_dict["TODOIST_API_KEY"]
    s3_bucket_name = os.environ["S3_BUCKET_NAME"]
    api = TodoistAPI(todoist_api_key)

    try:
        tasks = api.get_tasks()
        json_str = tasks_to_json(tasks)
        print(json_str)
        s3 = boto3.client("s3")
        s3.put_object(Bucket=s3_bucket_name, Key="data/biftu_tasks.json", Body=json_str)
    except Exception as error:
        print(error)

    return {"statusCode": 200, "body": json.dumps(json_str)}


if __name__ == "__main__":
    lambda_handler(None, None)