import openai
import json
import os

def lambda_handler(event, context):
    task = json.loads(event['body'])
    
    openai.api_key = os.getenv('OPENAI_API_KEY')
    
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Task details: {task}",
        max_tokens=50
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(response['choices'][0]['text'])
    }