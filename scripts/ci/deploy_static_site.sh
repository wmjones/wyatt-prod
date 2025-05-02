#!/bin/bash
set -e

# This script manually deploys the static site to S3 and invalidates CloudFront
# It's useful for local testing or if you need to manually deploy without GitHub Actions

# Configuration variables
ENVIRONMENT=${1:-dev}  # Default to dev if not specified
AWS_REGION="us-east-2"  # Update this with your AWS region

echo "Deploying static site to $ENVIRONMENT environment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Get the S3 bucket name and CloudFront distribution ID
echo "Getting S3 bucket name and CloudFront distribution ID..."
BUCKET_NAME=$(aws ssm get-parameter --name "/wyatt-personal-aws-$ENVIRONMENT/frontend_bucket_name" --query "Parameter.Value" --output text)
CF_ID=$(aws ssm get-parameter --name "/wyatt-personal-aws-$ENVIRONMENT/cloudfront_id" --query "Parameter.Value" --output text --region $AWS_REGION 2>/dev/null || echo "")

# Check if bucket name was retrieved successfully
if [ -z "$BUCKET_NAME" ] || [ "$BUCKET_NAME" == "None" ]; then
    echo "Failed to get S3 bucket name. Please run the SSM parameters setup workflow first."
    exit 1
fi

echo "Deploying to S3 bucket: $BUCKET_NAME"
aws s3 sync src/frontend/static-site/ s3://$BUCKET_NAME/ --delete --region $AWS_REGION

# If CloudFront distribution ID is available, invalidate the cache
if [ -n "$CF_ID" ] && [ "$CF_ID" != "None" ]; then
    echo "Invalidating CloudFront distribution: $CF_ID"
    aws cloudfront create-invalidation --distribution-id $CF_ID --paths "/*" --region $AWS_REGION
else
    echo "No CloudFront distribution ID found. Skipping cache invalidation."
fi

echo "Deployment completed successfully!"

# Get and display the website URL
if [ -n "$CF_ID" ] && [ "$CF_ID" != "None" ]; then
    CF_DOMAIN=$(aws cloudfront get-distribution --id $CF_ID --query "Distribution.DomainName" --output text --region $AWS_REGION)
    echo "Website URL: https://$CF_DOMAIN"
else
    S3_WEBSITE_URL=$(aws s3 website s3://$BUCKET_NAME --region $AWS_REGION 2>/dev/null || echo "")
    if [ -n "$S3_WEBSITE_URL" ]; then
        echo "Website URL: $S3_WEBSITE_URL"
    else
        echo "Website URL: http://$BUCKET_NAME.s3-website.$AWS_REGION.amazonaws.com"
    fi
fi
