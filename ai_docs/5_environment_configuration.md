# Environment Configuration

## Overview

This project supports multiple deployment environments (dev, prod) using environment-specific variable files. The environment configuration approach has been updated to use explicit environment variables instead of implicit `terraform.workspace` references, improving maintainability and making the environment-specific configuration more explicit.

## Environment Structure

The project uses the following structure for environment configuration:

```
main/
  environments/
    dev.tfvars
    prod.tfvars
  modules/
    ...
  *.tf
```

## Variable Files

Each environment has its own `.tfvars` file containing environment-specific values:

### Example Variables

- `environment`: Environment name (dev, prod)
- `aws_region`: AWS region for deployment
- `domain_name`: Base domain name for the application
- `cognito_domain_prefix`: Prefix for Cognito domain
- `frontend_domain`: Domain for the frontend application
- `api_domain`: Domain for the API Gateway
- `cors_allowed_origins`: Allowed origins for CORS
- `lambda_runtime`: Runtime for Lambda functions
- `dynamodb_billing_mode`: Billing mode for DynamoDB tables

## Deployment Instructions

To deploy to a specific environment:

```bash
# Deploy to development environment
terraform apply -var-file=main/environments/dev.tfvars

# Deploy to production environment
terraform apply -var-file=main/environments/prod.tfvars
```

## Environment-Specific Resources

Resources are named with environment suffixes to prevent conflicts:

```hcl
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${var.environment}"
  # ...
}
```

## Best Practices

1. **Environment Isolation**: Each environment should have its own isolated resources
2. **Consistent Naming**: Use consistent naming patterns with environment suffixes
3. **Minimal Production Permissions**: Restrict who can deploy to production
4. **Variable Documentation**: Document the purpose of each variable
5. **Secrets Management**: Use AWS Secrets Manager for sensitive values
