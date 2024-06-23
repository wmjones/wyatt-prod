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
        self.name = name


def tasks_to_json(tasks: List[SuperTask]) -> str:
    tasks_dict = []
    for task in tasks:
        # if task.project_id == "2334637095":  # Biftu
        task_dict = asdict(task)
        tasks_dict.append(task_dict)
    return json.dumps(tasks_dict)


def markdown_to_notion_blocks(markdown_content):
    blocks = []
    lines = markdown_content.split('\n')
    
    for line in lines:
        if line.strip() == '':
            continue
        
        # Check for headings
        if line.startswith('#'):
            level = len(line.split()[0])
            content = line.lstrip('#').strip()
            blocks.append({
                "object": "block",
                "type": f"heading_{level}",
                f"heading_{level}": {
                    "rich_text": [{"type": "text", "text": {"content": content}}]
                }
            })
        
        # Check for bullet lists
        elif line.strip().startswith('- '):
            content = line.strip()[2:]
            blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": content}}]
                }
            })
        
        # Check for numbered lists
        elif re.match(r'^\d+\.', line.strip()):
            content = re.sub(r'^\d+\.', '', line).strip()
            blocks.append({
                "object": "block",
                "type": "numbered_list_item",
                "numbered_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": content}}]
                }
            })
        
        # Everything else as a paragraph
        else:
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": line}}]
                }
            })
    
    return blocks


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
