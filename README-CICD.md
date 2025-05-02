# CI/CD Pipeline for Frontend Deployment

This document describes the CI/CD pipeline set up for deploying the frontend application to AWS.

## Overview

The pipeline automates the following tasks:
- Deploying the static site to S3
- Invalidating the CloudFront cache after deployment
- (Future) Building and deploying the React SPA

## Workflows

### 1. Frontend Static Site Deployment

**File**: `.github/workflows/frontend_deploy.yml`

This workflow deploys the static site to S3 and invalidates the CloudFront cache. It runs automatically when changes are pushed to the `src/frontend/static-site` directory on the `dev` or `main` branches. It can also be triggered manually.

The workflow:
1. Checks out the code
2. Configures AWS credentials using access keys
3. Retrieves the S3 bucket name and CloudFront distribution ID from SSM parameters
4. Syncs the static site files to the S3 bucket
5. Invalidates the CloudFront cache

### 2. SSM Parameter Configuration

**File**: `.github/workflows/ssm_params.yml`

This workflow configures the SSM parameters needed for the frontend deployment. It's a one-time setup workflow that should be run manually before using the frontend deployment workflow.

The workflow:
1. Identifies the S3 bucket and CloudFront distribution for the specified environment
2. Creates or updates SSM parameters with these values

## Required Secrets

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment

## IAM Permissions Required

The IAM user used for GitHub Actions should have these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:ListDistributions",
        "cloudfront:GetDistribution"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:PutParameter"
      ],
      "Resource": "arn:aws:ssm:*:*:parameter/wyatt-personal-aws-*"
    }
  ]
}
```

## Getting Started

1. Create an IAM user with the required permissions
2. Add the AWS access key and secret key as secrets to your GitHub repository
3. Run the `ssm_params.yml` workflow manually to set up SSM parameters
4. Push changes to `src/frontend/static-site` or manually trigger the frontend deployment workflow

## Future Enhancements

The pipeline will be extended to include:

1. Building and deploying the React SPA with TypeScript
2. Running tests before deployment
3. Environment-specific configuration
4. Staged deployments with approval steps
