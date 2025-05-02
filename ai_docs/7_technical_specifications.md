# Technical Specifications

## AWS Services Used

The project leverages the following AWS services:

- **Lambda**: Serverless compute for all application logic
- **DynamoDB**: NoSQL database for data storage
- **API Gateway**: HTTP and WebSocket APIs for frontend communication
- **S3**: Object storage for static assets and data files
- **CloudFront**: Content delivery network for frontend assets
- **Cognito**: User authentication and authorization
- **Step Functions**: Workflow orchestration for the productivity system
- **EventBridge**: Scheduled execution of workflows
- **IAM**: Identity and access management for secure resource access
- **CloudWatch**: Monitoring and logging
- **Route 53**: DNS configuration for custom domains
- **VPC**: Private networking for secure resource access

## Frontend Technologies

- **React**: Frontend framework for building the user interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **D3.js**: Data visualization library
- **AWS Amplify**: SDK for integrating with AWS services
- **Vite**: Build tool for frontend development

## Backend Technologies

- **Python**: Primary language for Lambda functions
- **AWS SDK for Python (boto3)**: AWS service integration
- **Terraform**: Infrastructure as code for AWS resource provisioning
- **OpenAI API**: ChatGPT integration for task enrichment
- **Todoist API**: Task management integration
- **Notion API**: Knowledge management integration

## Data Storage

### DynamoDB Tables

1. **Parameter Table**:
   - Stores visualization parameters
   - Partition key: `paramId` (String)
   - Sort key: `timestamp` (Number)
   - Attributes: `mean`, `stdDev`, `lastUpdatedBy`, `userId`, `lastUpdatedAt`

2. **History Table**:
   - Tracks parameter changes
   - Partition key: `userId` (String)
   - Sort key: `timestamp` (Number)
   - GSI: `ParamNameIndex` (paramName, timestamp)
   - Attributes: `paramName`, `oldValue`, `newValue`, `userEmail`

3. **Connection Table**:
   - Manages WebSocket connections
   - Partition key: `connectionId` (String)
   - Attributes: `timestamp`, `ttl`

4. **Task Table**:
   - Stores tasks from Todoist
   - Partition key: `taskId` (String)
   - Attributes: `title`, `content`, `status`, `enriched`, `enrichmentData`

## API Endpoints

### HTTP API Gateway

- `GET /api/normal-distribution`: Get current visualization parameters
- `POST /api/normal-distribution`: Update visualization parameters
- `GET /api/tasks`: Get tasks from the productivity system
- `POST /api/tasks`: Add a new task to the productivity system

### WebSocket API Gateway

- `$connect`: Handle WebSocket connection establishment
- `$disconnect`: Handle WebSocket disconnection
- Message types supported:
  - `PARAMS_UPDATE`: Real-time parameter updates

## Security Considerations

- **Authentication**: Cognito user pools with Multi-Factor Authentication support
- **Authorization**: JWT token verification for API access
- **CORS**: Controlled cross-origin resource sharing
- **IAM Policies**: Least privilege access for all components
- **API Rate Limiting**: Prevent abuse through throttling
- **Input Validation**: Strict validation on all API inputs
- **Encryption**: Data encryption at rest and in transit
- **Secrets Management**: Secure management of API keys and credentials
