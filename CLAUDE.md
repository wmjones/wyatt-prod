# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# D3 Dashboard & Productivity System

## Project Overview

This project consists of two distinct but related serverless applications:

1. **Interactive D3 Visualization Dashboard**: A dynamic web application that allows users to view and modify data visualizations built with D3.js. The application features user authentication, private data storage, and interactive visualization editing capabilities.

2. **Productivity Workflow System**: An automated pipeline that integrates Todoist tasks with ChatGPT and Notion for task enrichment and organization.

## Architecture Principles

### Terraform Modules First Approach

This project follows a "modules first" approach to infrastructure as code:

- **Use Community Modules**: We leverage the `terraform-aws-modules` collection wherever possible to reduce boilerplate code and follow established best practices.
- **DRY Infrastructure**: By using modules, we avoid repetitive configuration and ensure consistency across resources.
- **Maintainability**: Modules abstract away complex resource relationships and make the codebase easier to understand and maintain.
- **Versioning**: All modules are pinned to specific versions to ensure deployment stability.

### Serverless Architecture

The entire system is built on serverless components:

- **Zero Server Management**: No EC2 instances or containers to maintain
- **Cost Efficiency**: Pay-per-use pricing model with minimal costs during low-usage periods
- **Automatic Scaling**: Resources scale automatically with demand
- **High Availability**: Built-in redundancy across availability zones

## D3 Dashboard Components

The visualization dashboard consists of:

### Frontend
- **React SPA**: Single-page application built with React and TypeScript
- **D3.js Integration**: Interactive data visualizations with drag-and-drop editing
- **Authentication**: AWS Cognito for user management and JWT-based authentication
- **Deployment**: Static assets in S3 delivered through CloudFront CDN

### Backend
- **API Gateway**: HTTP API with JWT authorization
- **Lambda Functions**: Python-based serverless functions for data operations
- **DynamoDB**: NoSQL database for user data storage
- **Cognito User Pools**: User authentication and authorization

## Productivity System Components

The Todoist integration workflow includes:

- **Step Functions**: Orchestrates the entire workflow
- **Lambda Functions**: Serverless functions for each step of the process
- **EventBridge**: Scheduled execution of the workflow
- **S3**: Data storage for task information
- **External APIs**: Integration with Todoist, ChatGPT, and Notion

## Key Terraform Modules Used

This project leverages several key modules from the terraform-aws-modules collection:

- **VPC**: Network configuration
- **Lambda**: Serverless compute functions 
- **DynamoDB**: NoSQL database tables
- **S3**: Object storage buckets
- **CloudFront**: Content delivery network
- **API Gateway v2**: HTTP API endpoints
- **Cognito**: User authentication
- **Step Functions**: Workflow orchestration
- **EventBridge**: Event scheduler
- **IAM**: Identity and access management

## Getting Started

### Prerequisites

- AWS Account
- Terraform (v1.6.0+)
   - deployed using API calls for terraform cloud
- Domain name for the application
- API keys for Todoist, OpenAI, and Notion (for productivity system)

## License

This project is licensed under the MIT License - see the LICENSE file for details.