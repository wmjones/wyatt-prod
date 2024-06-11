from openai import OpenAI
import json
import os
import boto3


def lambda_handler(event, context):
    s3_bucket_name = os.environ["S3_BUCKET_NAME"]
    open_ai_key = os.environ["OPENAI_API_KEY"]
    # task = json.loads(event["body"])
    # Read from S3 incomplete_tasks.json and get the content field of each task
    s3 = boto3.client("s3")
    response = s3.get_object(Bucket=s3_bucket_name, Key="data/incomplete_tasks.json")
    data = json.loads(response["Body"].read().decode("utf-8"))
    print(f"data: {data}")

    tasks = [task["content"] for task in data]  # Extract the content field of each task
    print(f"tasks[0]: {tasks[0]}")

    client = OpenAI(
        # This is the default and can be omitted
        api_key=open_ai_key,
    )
    print(f"client: {client}")

    with open("biftu.txt", "r") as file:
        biftu_system_prompt = file.read()
    print(f"biftu_system_prompt: {biftu_system_prompt}")

    completions = []

    for task in tasks:
        print(f"\ntask: {task}")
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": biftu_system_prompt,
                },
                {
                    "role": "user",
                    "content": task,
                },
            ],
            model="gpt-4o",
        )

        completions.append(
            chat_completion.choices[0].message.content
        )  # Append the content of the chat completion to the completions list
        break

    print(completions)
    return {"statusCode": 200, "body": json.dumps(completions)}  # Serialize completions list to JSON


if __name__ == "__main__":
    lambda_handler(None, None)
