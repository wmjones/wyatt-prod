# Testing Environment Best Practices

## Environment Variable Handling in Tests

### Problem: TypeScript Errors with `process.env.NODE_ENV`

In test files, we often need to mock different environments (development, production, test) to verify component behavior in various contexts. However, directly modifying `process.env.NODE_ENV` causes TypeScript errors:

```typescript
// ❌ ERROR - This approach causes TypeScript errors
process.env.NODE_ENV = 'development'; // TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
```

### Solution: Environment Utility Functions

To solve this issue, we've created an environment utility module that provides type-safe functions for checking and mocking environments:

```typescript
// src/utils/environment.ts
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};
```

### Using Environment Functions in Components

In your components, use these utility functions instead of directly accessing `process.env.NODE_ENV`:

```typescript
// ✅ GOOD - Use the environment utility
import { isDevelopment } from '../utils/environment';

function MyComponent() {
  return (
    <div>
      {isDevelopment() && (
        <div className="dev-mode-indicator">Development Mode</div>
      )}
      {/* Component content */}
    </div>
  );
}
```

### Testing with Environment Mocks

We've also created test utilities to mock these environment functions in tests:

```typescript
// src/test-utils/environment-test-utils.ts
import * as environmentModule from '../utils/environment';

// Mock the environment as development
export const mockDevelopmentEnvironment = (): jest.SpyInstance => {
  return jest.spyOn(environmentModule, 'isDevelopment').mockReturnValue(true);
};

// Mock the environment as production
export const mockProductionEnvironment = (): jest.SpyInstance => {
  return jest.spyOn(environmentModule, 'isDevelopment').mockReturnValue(false);
};

// Reset all environment mocks
export const resetEnvironmentMocks = (): void => {
  jest.restoreAllMocks();
};
```

### Example Test Using Environment Mocks

```typescript
import { render, screen } from '@testing-library/react';
import { mockDevelopmentEnvironment, resetEnvironmentMocks } from '../test-utils/environment-test-utils';
import MyComponent from './MyComponent';

// Set up and tear down for environment mocking
afterEach(() => {
  resetEnvironmentMocks();
});

test('shows dev mode indicator in development environment', () => {
  // Mock the environment as development
  mockDevelopmentEnvironment();

  render(<MyComponent />);

  expect(screen.getByText('Development Mode')).toBeInTheDocument();
});
```

## Benefits of This Approach

1. **Type Safety**: No more TypeScript errors with read-only properties
2. **Testability**: Easy to mock environment conditions in tests
3. **Maintainability**: Single source of truth for environment checks
4. **Consistency**: Standardized approach across the codebase
5. **Readability**: More explicit and descriptive than direct property access

## Implementation Steps for Existing Code

1. Replace direct `process.env.NODE_ENV` checks with utility function calls
2. Update tests to use the environment test utilities for mocking
3. Run TypeScript checks to ensure no remaining errors
