# D3 Dashboard & Productivity System

This repository contains the infrastructure code for a serverless application that integrates Todoist, ChatGPT, and Notion, along with a D3-based visualization dashboard.

## Documentation

Please see the [ai_docs](./ai_docs) directory for detailed documentation about this project.

- [Project Overview](./ai_docs/README.md)
- [Phase 2 Implementation Plans](./ai_docs/phase2.md)
- [Phase 2.1 Evaluation](./ai_docs/phase2_1.md)

## Architecture

The project uses Terraform to deploy a fully serverless architecture on AWS, including:

- Lambda functions
- DynamoDB tables
- API Gateway endpoints
- CloudFront distributions
- S3 buckets
- Step Functions
- EventBridge triggers
- Cognito authentication

See [CLAUDE.md](./CLAUDE.md) for comprehensive architecture details.
