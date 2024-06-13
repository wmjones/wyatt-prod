import json
from todoist_api_python.api import TodoistAPI
import re

from dataclasses import dataclass, asdict
from typing import List

from utils import get_secret


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
    return clean_text


def task_to_dict(task: Task) -> dict:
    task.content = strip_rich_text(task.content)
    return asdict(task)


# https://app.todoist.com/app/project/biftu-6VV7CJ3xMGHQXh5r


def tasks_to_json(tasks: List[Task]) -> str:
    tasks_dict = []
    for task in tasks:
        if task.project_id == "2334637095":  # Biftu
            task_dict = task_to_dict(task)
            tasks_dict.append(task_dict)
    return json.dumps(tasks_dict, indent=4)


def lambda_handler(event, context):
    secret = get_secret("todoist_key", "us-east-2")
    secret_dict = json.loads(secret)
    todoist_api_key = secret_dict["TODOIST_API_KEY"]
    api = TodoistAPI(todoist_api_key)

    try:
        tasks = api.get_tasks()
        json_str = tasks_to_json(tasks)
        print(json_str)
    except Exception as error:
        print(error)

    return {"statusCode": 200, "body": json_str}


if __name__ == "__main__":
    lambda_handler(None, None)
