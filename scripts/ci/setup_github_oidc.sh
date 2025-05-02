#!/bin/bash
set -e

# This script sets up GitHub OIDC authentication for AWS
# It creates an OIDC provider and IAM role that GitHub Actions can assume

# Configuration variables
GITHUB_ORG="your-github-org"  # Update this with your GitHub organization or username
GITHUB_REPO="wyatt-personal-aws"  # Update this with your repository name
AWS_REGION="us-east-2"  # Update this with your AWS region
ROLE_NAME="GithubActionsOIDCRole"
PROVIDER_URL="token.actions.githubusercontent.com"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install it first."
    exit 1
fi

echo "Setting up GitHub OIDC authentication for AWS..."

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
echo "AWS Account ID: $AWS_ACCOUNT_ID"

# Create trust policy document for the role
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${PROVIDER_URL}"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "${PROVIDER_URL}:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "${PROVIDER_URL}:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:*"
                }
            }
        }
    ]
}
EOF

# Create deployment policy document
cat > deployment-policy.json << EOF
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
                "arn:aws:s3:::wyatt-personal-aws-*",
                "arn:aws:s3:::wyatt-personal-aws-*/*"
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
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "s3api:ListBuckets"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Check if OIDC provider already exists
OIDC_PROVIDER_EXISTS=$(aws iam list-open-id-connect-providers | jq -r ".OpenIDConnectProviderList[] | select(.Arn | contains(\"${PROVIDER_URL}\")) | .Arn")

if [ -z "$OIDC_PROVIDER_EXISTS" ]; then
    echo "Creating OIDC provider..."
    aws iam create-open-id-connect-provider \
        --url "https://${PROVIDER_URL}" \
        --client-id-list "sts.amazonaws.com" \
        --thumbprint-list "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
    echo "OIDC provider created successfully."
else
    echo "OIDC provider already exists: $OIDC_PROVIDER_EXISTS"
fi

# Check if role already exists
ROLE_EXISTS=$(aws iam get-role --role-name "$ROLE_NAME" 2>/dev/null || echo "")

if [ -z "$ROLE_EXISTS" ]; then
    echo "Creating IAM role..."
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file://trust-policy.json
    echo "IAM role created successfully."
else
    echo "IAM role already exists. Updating trust policy..."
    aws iam update-assume-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-document file://trust-policy.json
fi

# Create and attach inline policy
echo "Creating and attaching deployment policy..."
aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "DeploymentPolicy" \
    --policy-document file://deployment-policy.json

# Clean up temporary files
rm -f trust-policy.json deployment-policy.json

# Output the role ARN
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text)
echo "Setup completed successfully!"
echo "Add the following secret to your GitHub repository:"
echo "Name: AWS_ROLE_TO_ASSUME"
echo "Value: $ROLE_ARN"
echo ""
echo "Also update the GITHUB_ORG and GITHUB_REPO variables in this script if you run it again."
