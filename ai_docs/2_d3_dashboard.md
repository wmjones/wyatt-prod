# D3 Visualization Dashboard

## Overview

The D3 Visualization Dashboard is a modern web application that allows users to create, view, and modify interactive data visualizations using D3.js. The application is built on a serverless architecture and features real-time updates, user authentication, and collaborative editing.

## Features

- **Interactive Visualizations**: Create and modify D3.js visualizations with a user-friendly interface
- **Real-time Updates**: See changes from other users in real-time through WebSocket connections
- **User Authentication**: Secure access with Cognito user pools
- **Private Data Storage**: User-specific visualization configurations stored in DynamoDB
- **Change History**: Track modifications to visualizations with detailed history

## Architecture Components

### Frontend

- **React SPA**: Single-page application built with React and TypeScript
- **D3.js Integration**: Interactive data visualizations with drag-and-drop editing
- **Authentication**: AWS Cognito for user management and JWT-based authentication
- **Deployment**: Static assets in S3 delivered through CloudFront CDN

### Backend

- **API Gateway**: HTTP API with JWT authorization for REST endpoints
- **WebSocket API**: Real-time updates for collaborative editing
- **Lambda Functions**: Python-based serverless functions for data operations
- **DynamoDB**: NoSQL database for visualization data storage
- **Cognito User Pools**: User authentication and authorization

## Implementation Status (Phase 2.1)

The current implementation includes:

1. **DynamoDB Tables**:
   - Parameter table for storing normal distribution parameters
   - History table for tracking parameter changes
   - Connection table for managing WebSocket connections

2. **Lambda Functions**:
   - getVisualizationData.py - Retrieves current visualization parameters
   - updateVisualizationParams.py - Updates parameters and broadcasts changes
   - wsConnect.py and wsDisconnect.py - Handle WebSocket connections

3. **API Gateway**:
   - HTTP API with routes for getting and updating visualization data
   - WebSocket API for real-time updates

4. **Frontend**:
   - Basic React application with AWS Amplify integration
   - Authentication flow using Cognito
   - API testing functionality

## Next Steps

1. Implement D3.js visualization components
2. Add WebSocket integration for real-time updates
3. Create parameter control UI
4. Complete frontend build and deployment process
5. Perform end-to-end testing
