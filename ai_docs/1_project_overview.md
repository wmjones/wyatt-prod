# D3 Dashboard & Productivity System

## Project Overview

This project consists of two distinct but related serverless applications:

1. **Interactive D3 Visualization Dashboard**: A dynamic web application that allows users to view and modify data visualizations built with D3.js. The application features user authentication, private data storage, and interactive visualization editing capabilities.

2. **Productivity Workflow System**: An automated pipeline that integrates Todoist tasks with ChatGPT and Notion for task enrichment and organization.

## Architecture Principles

### Terraform Modules First Approach

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

## Development Environment

- Pre-configured VS Code DevContainer with:
  - Terraform, Node.js, Python, and all required dependencies
  - Built-in Claude Code integration
  - TaskMaster AI for project management
  - Context7 for documentation lookup

## Deployment Process

1. Configure AWS credentials
2. Update environment-specific variables
3. Run `terraform init` to initialize the working directory
4. Run `terraform apply -var-file=main/environments/<env>.tfvars` to deploy the infrastructure
