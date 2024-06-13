from openai import OpenAI
import json
from utils import get_secret
from getTodoist import Task
from dataclasses import asdict


def lambda_handler(event, context):
    print(f"event: {event}")
    secret = get_secret("open_ai_key", "us-east-2")
    secret_dict = json.loads(secret)

    client = OpenAI(
        # This is the default and can be omitted
        api_key=secret_dict["OPEN_AI_KEY"],
    )

    with open("biftu.txt", "r") as file:
        biftu_system_prompt = file.read()

    try:
        for task in event['body']:
            print(f"\ntask: {task}")
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": f"{biftu_system_prompt}",
                    },
                    {
                        "role": "user",
                        "content": f"Create a detailed, actionable Kanban user story using this short prompt.\n{task['content']}",
                    },
                ],
                model="gpt-4o",
            )
            task_dict = {"output": chat_completion.choices[0].message.content}
            task_dict.update(asdict(Task(**task)))
    except Exception as error:
        print(error)
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}
    return {"statusCode": 200, "body": json.dumps(task_dict)}  # Serialize completions list to JSON


if __name__ == "__main__":
    event = [
        {
            "assignee_id": None,
            "assigner_id": None,
            "comment_count": 0,
            "is_completed": False,
            "content": "add new todoist pipeline for weight",
            "created_at": "2024-06-12T11:10:34.825542Z",
            "creator_id": "49425011",
            "description": "",
            "due": None,
            "id": "8110672962",
            "labels": [],
            "order": 1,
            "parent_id": None,
            "priority": 1,
            "project_id": "2334637095",
            "section_id": None,
            "url": "https://todoist.com/app/task/8110672962",
            "duration": None,
            "sync_id": None,
        }
    ]
    out = lambda_handler(event, None)
    print(out)
