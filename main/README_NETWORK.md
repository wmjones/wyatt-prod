# Network Infrastructure Documentation

This document provides an overview of the network infrastructure set up for the D3 Dashboard & Productivity System.

## VPC Configuration

The Virtual Private Cloud (VPC) is configured with the following components:

- **Multiple Availability Zones**: The VPC spans 3 availability zones for high availability.
- **Public Subnets**: Used for resources that need direct internet access (NAT Gateways, ALBs).
- **Private Subnets**: Used for Lambda functions and other resources that should not be directly accessible from the internet.
- **NAT Gateways**: Allow resources in private subnets to access the internet while remaining private.
- **VPC Flow Logs**: Enabled for security monitoring and troubleshooting.

### Environment-Specific Configuration

- **Production Environment**:
  - Multiple NAT Gateways (one per AZ) for high availability
  - Full set of VPC Endpoints for AWS services
  - Comprehensive flow logs

- **Development/Staging Environments**:
  - Single NAT Gateway to reduce costs
  - Limited VPC Endpoints (only Gateway Endpoints which are free)
  - Basic flow logs

## Security Groups

The following security groups are defined:

1. **Lambda Security Group**:
   - No inbound rules (Lambda functions don't accept inbound connections)
   - Outbound access to required services

2. **VPC Endpoints Security Group**:
   - Allows HTTPS (port 443) access from within the VPC

3. **Database Security Group** (for future use):
   - Allows database access only from Lambda functions

4. **ElastiCache Security Group** (for future use):
   - Allows Redis access only from Lambda functions

5. **Internal ALB Security Group** (for future use):
   - Allows HTTP/HTTPS access from within the VPC

## VPC Endpoints

VPC Endpoints are used to privately connect the VPC to supported AWS services without requiring an internet gateway or NAT device:

### Gateway Endpoints (Free)
- S3
- DynamoDB

### Interface Endpoints (Paid, production only)
- Lambda
- API Gateway
- Secrets Manager
- CloudWatch
- CloudWatch Logs
- EventBridge
- Systems Manager
- ECR API
- ECR Docker

## Lambda VPC Integration

Lambda functions can be configured to run inside the VPC when they need to access private resources:

- **Private Subnet Placement**: Lambda functions are placed in private subnets.
- **Security Group**: The Lambda security group is attached to functions.
- **VPC Access**: The Lambda role automatically gets the required permissions to create and manage elastic network interfaces.

## Usage Example

To deploy a Lambda function inside the VPC:

```hcl
module "my_function" {
  source = "./modules/lambda_function"

  function_name = "my-function"
  handler       = "index.handler"
  runtime       = "python3.12"
  zip_file      = local.lambda_zip_path

  # VPC configuration
  vpc_subnet_ids         = module.vpc.private_subnets
  vpc_security_group_ids = [aws_security_group.lambda.id]

  # Other configuration...
}
```

## Network Architecture Diagram

```
                                ┌───────────────────────────────────────────────┐
                                │                 Internet                      │
                                └─────────────────────┬─────────────────────────┘
                                                      │
                                ┌─────────────────────▼─────────────────────────┐
                                │             Internet Gateway                  │
                                └─────────────────────┬─────────────────────────┘
                                                      │
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ VPC                                                 │                                              │
│                                                     │                                              │
│               ┌──────────────────┐       ┌──────────▼──────────┐       ┌──────────────────┐       │
│               │  Public Subnet   │       │   Public Subnet     │       │  Public Subnet   │       │
│               │     (AZ-a)       │       │      (AZ-b)         │       │     (AZ-c)       │       │
│               │                  │       │                     │       │                  │       │
│               │ ┌──────────────┐ │       │ ┌─────────────────┐ │       │ ┌──────────────┐ │       │
│               │ │ NAT Gateway  │ │       │ │  NAT Gateway    │ │       │ │ NAT Gateway  │ │       │
│               │ └──────┬───────┘ │       │ └────────┬────────┘ │       │ └──────┬───────┘ │       │
│               └────────┼─────────┘       └──────────┼──────────┘       └────────┼─────────┘       │
│                        │                            │                           │                  │
│               ┌────────▼─────────┐       ┌──────────▼──────────┐       ┌────────▼─────────┐       │
│               │ Private Subnet   │       │  Private Subnet     │       │ Private Subnet   │       │
│               │     (AZ-a)       │       │      (AZ-b)         │       │     (AZ-c)       │       │
│               │                  │       │                     │       │                  │       │
│               │ ┌──────────────┐ │       │ ┌─────────────────┐ │       │ ┌──────────────┐ │       │
│               │ │Lambda Function│ │       │ │ Lambda Function │ │       │ │Lambda Function│ │       │
│               │ └──────────────┘ │       │ └─────────────────┘ │       │ └──────────────┘ │       │
│               └──────────────────┘       └─────────────────────┘       └──────────────────┘       │
│                                                                                                    │
│                                    ┌────────────────────────────┐                                  │
│                                    │     VPC Endpoints          │                                  │
│                                    │  (S3, DynamoDB, Lambda,    │                                  │
│                                    │   API Gateway, etc.)       │                                  │
│                                    └────────────────────────────┘                                  │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Best Practices

1. **Least Privilege Access**: Security groups follow the principle of least privilege.
2. **High Availability**: Production environment uses multiple AZs and NAT Gateways.
3. **Cost Optimization**: Development environments use a single NAT Gateway.
4. **Security**: All resources are placed in private subnets unless they need public access.
5. **VPC Endpoints**: Used to improve security and reduce NAT Gateway costs.
6. **Flow Logs**: Enabled for security monitoring and troubleshooting.

## Cost Considerations

- **NAT Gateways**: Incur hourly charges and data processing fees. Use a single NAT Gateway in non-production environments.
- **VPC Endpoints**: Interface endpoints (for services other than S3 and DynamoDB) incur hourly charges. Only enabled in production by default.
- **Lambda VPC Access**: Lambda functions in a VPC incur additional charges for ENI creation and management.
