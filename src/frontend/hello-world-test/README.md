# D3 Dashboard - Hello World Test

This is a simple "Hello World" test application to verify that the AWS infrastructure for the D3 Visualization Dashboard is correctly set up. This React application allows you to test Cognito authentication and API Gateway connectivity.

## Features

- Cognito user authentication (login/logout)
- API connection test to the normal distribution endpoint
- Display of user information and API responses

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- AWS account with deployed infrastructure (Cognito, API Gateway, Lambda)

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Create a `.env` file based on the `.env.example` template, updating with your AWS resources
4. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

Build the application:

```bash
npm run build
```

### Deployment

Update the `deploy` script in `package.json` with your S3 bucket name, then run:

```bash
npm run deploy
```

This will build the application and sync the built files to your S3 bucket.

## Configuration

Update the `.env` file with your AWS configuration:

```
# AWS Cognito authentication configuration
VITE_AWS_REGION=us-east-2
VITE_COGNITO_USER_POOL_ID=us-east-2_xxxxxxx
VITE_COGNITO_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxx
VITE_COGNITO_IDENTITY_POOL_ID=us-east-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# API Gateway endpoint
VITE_API_ENDPOINT=https://xxxxxxxx.execute-api.us-east-2.amazonaws.com/

# WebSocket API endpoint
VITE_WS_API_ENDPOINT=wss://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/production
```

## Troubleshooting

- If authentication fails, verify your Cognito configuration in `.env`
- If API tests fail, check that your Lambda functions are deployed and API Gateway is configured correctly
- For CORS errors, ensure your API Gateway has the correct CORS configuration
