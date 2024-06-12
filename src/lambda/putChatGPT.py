from openai import OpenAI
import json
import os
import boto3


def get_secret(secret_name, region_name):
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
        raise Exception("Couldn't retrieve the secret") from e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            secret = base64.b64decode(get_secret_value_response['SecretBinary'])
        
    return secret


def lambda_handler(event, context):
    s3_bucket_name = os.environ["S3_BUCKET_NAME"]
    open_ai_key = get_secret("OPEN_AI_KEY", "us-east-2")
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
                model="gpt-3.5-turbo",
                stream=True
            )

            completions.append(
                chat_completion.choices[0].message
            )  # Append the content of the chat completion to the completions list
            break
    except Exception as error:
        print(error)
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}

    print(completions)
    return {"statusCode": 200, "body": json.dumps(completions)}  # Serialize completions list to JSON
