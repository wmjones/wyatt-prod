# API Gateway Module

## Overview

This module creates and configures an HTTP API Gateway that serves as the backend API endpoint for the D3 Visualization Dashboard. It handles routing HTTP requests to appropriate Lambda functions and enforces authentication via Cognito.

## Components

- **HTTP API Gateway**: Creates a RESTful API endpoint
- **API Routes**: Configures paths and methods for API endpoints
- **Lambda Integrations**: Connects API routes to Lambda functions
- **CORS Configuration**: Enables cross-origin resource sharing
- **Authorization**: Integrates with Cognito for JWT-based authorization

## Variables

| Name | Description | Type | Required |
|------|-------------|------|----------|
| `name` | Name of the API Gateway | `string` | Yes |
| `description` | Description of the API Gateway | `string` | No |
| `cors_configuration` | CORS settings for the API | `map(any)` | No |
| `lambda_integrations` | Map of Lambda functions to integrate with API routes | `map(any)` | Yes |
| `authorizers` | Cognito authorizers configuration | `map(any)` | No |
| `tags` | Resource tags | `map(string)` | No |

## Outputs

| Name | Description |
|------|-------------|
| `api_id` | ID of the created API Gateway |
| `api_endpoint` | Endpoint URL of the API Gateway |
| `api_arn` | ARN of the API Gateway |
| `execution_arn` | Execution ARN for Lambda permissions |

## Integration with Project

The API Gateway module is a critical component in the D3 Dashboard architecture:

- **Frontend Integration**: The React SPA communicates with this API to fetch and update visualization data
- **Authentication Flow**: Works with Cognito to validate user tokens before allowing access to protected endpoints
- **Backend Processing**: Routes requests to appropriate Lambda functions based on the endpoint path and method
- **Security Boundary**: Provides a secure interface for accessing backend resources and data

This module is used in conjunction with the Lambda Function module to create a complete serverless backend for the application.
