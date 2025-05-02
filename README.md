# D3 Dashboard & Productivity System

This repository contains the infrastructure code for a serverless application that integrates Todoist, ChatGPT, and Notion, along with a D3-based visualization dashboard.

## Documentation

Please see the [ai_docs](./ai_docs) directory for detailed documentation about this project.

- [Project Overview](./ai_docs/README.md)
- [Phase 2 Implementation Plans](./ai_docs/phase2.md)
- [Phase 2.1 Evaluation](./ai_docs/phase2_1.md)

## Development Environment

This project includes a VS Code DevContainer configuration for a consistent development environment across all contributors.

### Features

- Pre-configured with Terraform, Node.js, Python, and all required dependencies
- Built-in Claude Code integration with MCP servers:
  - File System access to project files
  - TaskMaster AI for project management
  - Context7 for documentation lookup

### Getting Started

1. Install VS Code and the Remote - Containers extension
2. Open the project in VS Code
3. Click the remote indicator in the bottom-left corner
4. Select "Reopen in Container"

For more details, see the [DevContainer README](./.devcontainer/README.md).

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

## Environment Configuration

This project supports multiple deployment environments (dev, prod) using environment-specific variable files in the `main/environments/` directory.

### Environment Structure

The project uses the following structure for environment configuration:

```
main/
  environments/
    dev.tfvars     # Development environment variables
    prod.tfvars    # Production environment variables
    README.md      # Environment configuration documentation
```

Each environment file contains settings optimized for its specific purpose:

- **Development (dev)**: Cost-optimized settings with simpler infrastructure
- **Production (prod)**: High-availability settings with enhanced security and reliability

### Deployment Instructions

To deploy to a specific environment:

```bash
# Initialize Terraform
terraform init

# Plan deployment to development environment
terraform plan -var-file=main/environments/dev.tfvars

# Deploy to development environment
terraform apply -var-file=main/environments/dev.tfvars

# Deploy to production environment
terraform apply -var-file=main/environments/prod.tfvars
```

You can also use our deployment scripts which simplify the process:

```bash
# Deploy to development environment
./scripts/apply.sh dev

# Deploy to production environment
./scripts/apply.sh prod
```

### Adding New Environment Variables

When adding new environment-specific configuration:

1. Add the variable to both `dev.tfvars` and `prod.tfvars` files
2. Add a corresponding variable declaration in `variables.tf` with an appropriate default value
3. Update the environment README.md with the new variable information

For more detailed information about environment configuration, see [Environment Configuration Documentation](./ai_docs/5_environment_configuration.md).
