# D3 Visualization Dashboard

This project is a React application for visualizing data using D3.js.

## Features
- Interactive D3 visualizations
- Authentication using AWS Cognito
- Dashboard for exploring and editing visualizations
- Retro-styled UI elements

## Getting Started

### Prerequisites
- Node.js 18 or higher
- AWS account for Cognito configuration (see README-COGNITO.md)

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build
```bash
npm run build
```

Builds the app for production to the `build` folder.

## Testing Framework

This project uses a comprehensive testing framework with a minimal, user-centric approach. For details, see:

- [TESTING.md](./TESTING.md) - Overview of the testing strategy and utilities
- [TESTING-WORKFLOW.md](./TESTING-WORKFLOW.md) - How testing fits into the development workflow
- [TEST-SCRIPTS.md](./TEST-SCRIPTS.md) - Documentation of available test scripts

### Running Tests

```bash
# Run tests in watch mode (for development)
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests suitable for CI (skips problematic tests)
npm run test:ci

# Run end-to-end tests with Cypress
npm run test:e2e
```

## Documentation

- [README-COGNITO.md](./README-COGNITO.md) - Authentication setup instructions
- [README-CONFIG.md](./README-CONFIG.md) - Application configuration details

## Project Structure

- `/src/components` - React components
- `/src/components/ui` - Reusable UI components
- `/src/components/visualization` - D3 visualization components
- `/src/test-utils` - Testing utilities for D3 and authentication
- `/src/utils` - Utility functions
- `/cypress` - End-to-end tests

## Testing Approach

We follow a minimal, user-centric testing approach:

1. **Test what the user sees and interacts with**, not implementation details
2. **Focus on behavior, not internal state or methods**
3. **Use the Arrange-Act-Assert pattern** for test structure
4. **Minimize mocking** to test real behavior when possible
5. **D3 testing utilities** for simplified visualization testing

For more details, see the testing documentation files.
