import json
from datetime import datetime

def lambda_handler(event, context):
    task = json.loads(event['body'])
    
    if 'due' in task and task['due']:
        task['due']['date'] = datetime.strptime(task['due']['date'], '%Y-%m-%d').strftime('%d-%m-%Y')
    
    return {
        'statusCode': 200,
        'body': json.dumps(task)
    }