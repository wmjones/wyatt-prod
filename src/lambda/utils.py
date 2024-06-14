import boto3
from botocore.exceptions import ClientError
from typing import List
from getTodoist import Task
from dataclasses import asdict


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


class SuperTask(Task):
    def __init__(self, agent_output=None, **kwargs):
        super().__init__(**kwargs)
        self.agent_output = agent_output


def tasks_to_json(tasks: List[SuperTask]) -> str:
    tasks_dict = []
    for task in tasks:
        if task.project_id == "2334637095":  # Biftu
            task_dict = asdict(task)
            tasks_dict.append(task_dict)
    return json.dumps(tasks_dict)