import requests
import os

def lambda_handler(event, context):
    task = json.loads(event['body'])
    api_token = os.getenv('TODOIST_API_TOKEN')
    headers = {"Authorization": f"Bearer {api_token}"}
    
    response = requests.delete(f'https://api.todoist.com/rest/v1/tasks/{task["id"]}', headers=headers)
    
    return {
        'statusCode': response.status_code,
        'body': json.dumps({"message": "Task deleted"})
    }