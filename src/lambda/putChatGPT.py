from openai import OpenAI
import json
from utils import get_secret, SuperTask, tasks_to_json


def lambda_handler(event, context):
    print(f"event: {event}")
    secret = get_secret("open_ai_key", "us-east-2")
    secret_dict = json.loads(secret)

    client = OpenAI(
        # This is the default and can be omitted
        api_key=secret_dict["OPEN_AI_KEY"],
    )

    list_task_dict = []
    for json_task in json.loads(event["body"]):
        try:
            system_prompt = ""
            task = SuperTask(**json_task)
            print(f"\njson_task: {json_task}")
            print(f"\ntask: {task}")            
            if task.project_id == "2334637095":  # Work
                if task.section_id == "158311513":  # Biftu
                    with open("biftu.txt", "r") as file:
                        system_prompt = file.read()
                elif task.section_id == "158311520":  # Tony
                    with open("tony.txt", "r") as file:
                        system_prompt = file.read()
                if system_prompt == "":
                    pass
                else:
                    chat_completion = client.chat.completions.create(
                        messages=[
                            {
                                "role": "user",
                                "content": f"{system_prompt}",
                            },
                            {
                                "role": "user",
                                "content": f"{task.content}",
                            },
                        ],
                        model="gpt-4o",
                    )
                    task.agent_output = chat_completion.choices[0].message.content
                list_task_dict.append(task)
        except Exception as error:
            print(error)
            return {"statusCode": 500, "body": json.dumps({"error": str(error)})}
    return {"statusCode": 200, "body": tasks_to_json(list_task_dict)}  # Serialize completions list to JSON


if __name__ == "__main__":
    event = {
        "statusCode": 200,
        "body": '[\n    {\n        "assignee_id": null,\n        "assigner_id": null,\n        "comment_count": 0,\n        "is_completed": false,\n        "content": "add new todoist pipeline for weight",\n        "created_at": "2024-06-12T11:10:34.825542Z",\n        "creator_id": "49425011",\n        "description": "",\n        "due": null,\n        "id": "8110672962",\n        "labels": [],\n        "order": 1,\n        "parent_id": null,\n        "priority": 1,\n        "project_id": "2334637095",\n        "section_id": null,\n        "url": "https://todoist.com/app/task/8110672962",\n        "duration": null,\n        "sync_id": null\n    }\n]',
    }
    out = lambda_handler(event, None)
    print(out)
