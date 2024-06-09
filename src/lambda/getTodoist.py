import json
import boto3
import requests
import os

def lambda_handler(event, context):
    todoist_api_key = os.environ['TODOIST_API_KEY']
    s3_bucket_name = os.environ['S3_BUCKET_NAME']

    headers = {
        'Authorization': f'Bearer {todoist_api_key}'
    }

    response = requests.get('https://api.todoist.com/rest/v1/tasks?filter=(status=1)', headers=headers)
    data = response.json()

    s3 = boto3.client('s3')
    s3.put_object(
        Bucket=s3_bucket_name,
        Key='data/incomplete_tasks.json',
        Body=json.dumps(data),
        ContentType='application/json'
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Data saved to S3')
    }