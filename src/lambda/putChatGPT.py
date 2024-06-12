from openai import OpenAI
import json
import os
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

    secret = get_secret_value_response['SecretString']
    return secret


def lambda_handler(event, context):
    s3_bucket_name = os.environ["S3_BUCKET_NAME"]
    secret = get_secret("open_ai_key", "us-east-2")
    secret_dict = json.loads(secret)
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
        api_key=secret_dict['OPEN_AI_KEY'],
    )
    print(f"client: {client}")

    with open("biftu.txt", "r") as file:
        biftu_system_prompt = file.read()
    # print(f"biftu_system_prompt: {biftu_system_prompt}")

    completions = []

    try:
        for task in tasks:
            print(f"\ntask: {task}")
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": f"{biftu_system_prompt}",
                    },
                    {
                        "role": "user",
                        "content": f"Create a detailed, actionable Kanban user story using this short prompt.\n{task}",
                    },
                ],
                model="gpt-3.5-turbo"
            )

            completions.append(
                chat_completion.choices[0].message.content
            )  # Append the content of the chat completion to the completions list
            break
    except Exception as error:
        print(error)
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}

    print(completions)
    return {"statusCode": 200, "body": json.dumps(completions)}  # Serialize completions list to JSON


if __name__ == "__main__":
    lambda_handler(None, None)