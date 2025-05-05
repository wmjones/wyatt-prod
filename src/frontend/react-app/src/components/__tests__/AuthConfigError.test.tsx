import React from 'react';
import { render, screen } from '../../test-utils/testing-library-utils';
import AuthConfigError from '../AuthConfigError';
import {
  mockDevelopmentEnvironment,
  mockProductionEnvironment,
  resetEnvironmentMocks
} from '../../test-utils/environment-test-utils';

/**
 * AuthConfigError Component Tests
 *
 * These tests verify the component renders correctly in different environments
 * and with various error conditions.
 *
 * NOTE: We use environment utility functions instead of directly modifying
 * process.env.NODE_ENV, which is a read-only property in TypeScript
 * and would cause type errors. See /docs/testing-environment-best-practices.md
 */

// Set up and tear down for environment mocking
beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  resetEnvironmentMocks();
});

describe('AuthConfigError Component', () => {
  // Test with development placeholder values
  it('renders development mode message with placeholder credentials', () => {
    render(
      <AuthConfigError
        error="Invalid configuration"
        userPoolId="us-east-1_xxxxxxxx"
        clientId="1a2b3c4dxxxxxxxxxxxxxxxxxxxxxxxxxx"
      />
    );

    expect(screen.getByText('Development Mode Active')).toBeInTheDocument();
    expect(screen.getByText('Authentication is using development mode credentials.')).toBeInTheDocument();
    expect(screen.getByText('This is expected in development environments. Use the demo email and password to login.')).toBeInTheDocument();
  });

  // Test with user pool client error
  it('renders user pool client error message', () => {
    render(
      <AuthConfigError
        error="User pool client does not exist"
        userPoolId="us-east-1_abcdefghi"
        clientId="1a2b3c4defghijklmnopqrstu"
      />
    );

    expect(screen.getByText('User Pool Client Error')).toBeInTheDocument();
    expect(screen.getByText('The authentication client configuration is invalid.')).toBeInTheDocument();
    expect(screen.getByText('Please contact the administrator with error code: USER_POOL_CLIENT_ERROR')).toBeInTheDocument();
  });

  // Test with generic error
  it('renders generic error message for other errors', () => {
    render(
      <AuthConfigError
        error="Unknown error"
        userPoolId="us-east-1_abcdefghi"
        clientId="1a2b3c4defghijklmnopqrstu"
      />
    );

    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(screen.getByText('There was a problem with the authentication service.')).toBeInTheDocument();
    expect(screen.getByText('Please try again later or contact support.')).toBeInTheDocument();
  });

  // Test developer information visibility in development
  it('shows developer information in development environment', () => {
    /**
     * Instead of directly modifying process.env.NODE_ENV which causes TypeScript errors:
     * ❌ process.env.NODE_ENV = 'development'; // TS2540: Cannot assign to read-only property
     *
     * Use our environment test utilities to mock the environment safely:
     */
    mockDevelopmentEnvironment();

    render(
      <AuthConfigError
        error="Test error"
        userPoolId="us-east-1_abcdefghi"
        clientId="1a2b3c4defghijklmnopqrstu"
      />
    );

    expect(screen.getByText('Developer Information:')).toBeInTheDocument();
    expect(screen.getByText(/- User Pool ID: us-east-1_abcdefghi/)).toBeInTheDocument();
    expect(screen.getByText(/- Client ID: 1a2b3.../)).toBeInTheDocument();
    expect(screen.getByText(/- Error: Test error/)).toBeInTheDocument();
  });

  // Test missing credentials handling
  it('handles missing credentials gracefully', () => {
    // Mock the environment as development
    mockDevelopmentEnvironment();

    render(<AuthConfigError error="Configuration error" />);

    // In development mode, we should see the developer information
    expect(screen.getByText(/- User Pool ID: Not available/)).toBeInTheDocument();
    expect(screen.getByText(/- Client ID: Not available/)).toBeInTheDocument();
  });

  // Test correct icon display for development mode
  it('displays info icon for development mode', () => {
    const { container } = render(
      <AuthConfigError
        error="Invalid configuration"
        userPoolId="us-east-1_xxxxxxxx"
        clientId="1a2b3c4dxxxxxxxxxxxxxxxxxxxxxxxxxx"
      />
    );

    // Check for blue info icon container
    const blueIconContainer = container.querySelector('.bg-blue-100');
    expect(blueIconContainer).toBeInTheDocument();

    // Check for blue icon color
    const blueIcon = container.querySelector('.text-blue-500');
    expect(blueIcon).toBeInTheDocument();
  });

  // Test correct icon display for error mode
  it('displays warning icon for error mode', () => {
    const { container } = render(
      <AuthConfigError
        error="User pool client does not exist"
        userPoolId="us-east-1_abcdefghi"
        clientId="1a2b3c4defghijklmnopqrstu"
      />
    );

    // Check for red warning icon container
    const redIconContainer = container.querySelector('.bg-red-100');
    expect(redIconContainer).toBeInTheDocument();

    // Check for red icon color
    const redIcon = container.querySelector('.text-red-500');
    expect(redIcon).toBeInTheDocument();
  });
});
