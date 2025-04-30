#!/bin/bash

# Deploy script for the D3 Dashboard Hello World test app

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables
BUCKET_NAME="your-s3-bucket-name"
DISTRIBUTION_ID="your-cloudfront-distribution-id"

# Build the application
echo "Building application..."
npm run build

# Deploy to S3
echo "Deploying to S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete

# Invalidate CloudFront cache (if using CloudFront)
if [ -n "$DISTRIBUTION_ID" ]; then
  echo "Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

echo "Deployment complete!"
