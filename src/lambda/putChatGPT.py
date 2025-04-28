from openai import OpenAI
import json

from utils import get_secret, SuperTask, tasks_to_json


def lambda_handler(event, context):
    """AWS Lambda entry point."""
    print(f"event: {event}")

    secret = get_secret("open_ai_key", "us-east-2")
    secret_dict = json.loads(secret)

    with open("config.json", "r") as file:
        config = json.load(file)

    project_id_list = [project["project_id"] for project in config["projects"]]

    client = OpenAI(api_key=secret_dict["OPEN_AI_KEY"])

    tasks = []
    for json_task in json.loads(event["body"]):
        try:
            system_prompt = ""
            task = SuperTask(**json_task)

            print(f"\njson_task: {json_task}")
            print(f"\ntask: {task}")

            if int(task.project_id) not in project_id_list:
                continue

            idx = project_id_list.index(int(task.project_id))
            project_cfg = config["projects"][idx]

            task.passChatGPT = project_cfg["passChatGPT"]
            task.name = project_cfg["name"]

            if task.section_id == "158311513":  # Biftu
                with open("biftu.txt", "r") as file:
                    system_prompt = file.read()
            elif task.section_id == "158311520":  # Tony
                with open("tony.txt", "r") as file:
                    system_prompt = file.read()

            if system_prompt:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "user", "content": system_prompt},
                        {"role": "user", "content": task.content},
                    ],
                    model="gpt-4o",
                )
                task.agent_output = chat_completion.choices[0].message.content

            tasks.append(task)

        except Exception as error:  # noqa: BLE001
            print(error)
            return {
                "statusCode": 500,
                "body": json.dumps({"error": str(error)}),
            }

    return {
        "statusCode": 200,
        "body": tasks_to_json(tasks),
    }


if __name__ == "__main__":
    event = {
        "statusCode": 200,
        "body": (
            '[{"assignee_id": null, "assigner_id": null, "comment_count": 0, '
            '"is_completed": false, "content": "add new todoist pipeline for weight", '
            '"created_at": "2024-06-12T11:10:34.825542Z", "creator_id": "49425011", '
            '"description": "", "due": null, "id": "8110672962", "labels": [], '
            '"order": 1, "parent_id": null, "priority": 1, "project_id": "2334044360", '
            '"section_id": "158311513", "url": '
            '"https://todoist.com/app/task/8110672962", "duration": null, '
            '"sync_id": null}]'
        ),
    }
    print(lambda_handler(event, None))
