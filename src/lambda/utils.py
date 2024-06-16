import boto3
from botocore.exceptions import ClientError
from typing import List
from dataclasses import dataclass, asdict
import json


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


@dataclass
class SuperTask(Task):
    agent_output: str = ""
    passChatGPT: bool = True
    name: str = ""

    def __init__(
            self,
            agent_output="",
            passChatGPT=True,
            name="",
            **kwargs
        ):
        super().__init__(**kwargs)
        self.agent_output = agent_output
        self.passChatGPT = passChatGPT
        self.name = ""


def tasks_to_json(tasks: List[SuperTask]) -> str:
    tasks_dict = []
    for task in tasks:
        # if task.project_id == "2334637095":  # Biftu
        task_dict = asdict(task)
        tasks_dict.append(task_dict)
    return json.dumps(tasks_dict)


def get_secret(secret_name, region_name):
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    return get_secret_value_response["SecretString"]
