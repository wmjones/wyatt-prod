/**
 * Authentication testing utilities for React components
 */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
// Import auth module
import * as authModule from '../utils/auth';

// Set up the mock implementation for Jest
jest.mock('../utils/auth', () => ({
  getCurrentUser: jest.fn(),
  signIn: jest.fn(),
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  signOut: jest.fn(),
  getEnvConfig: jest.fn(),
  AuthState: {
    SIGNED_IN: 'SIGNED_IN',
    SIGNED_OUT: 'SIGNED_OUT',
    LOADING: 'LOADING',
    CONFIG_ERROR: 'CONFIG_ERROR'
  }
}));

// Import AuthState type from auth module for use in mocks
import { AuthState } from '../utils/auth';

/**
 * Mock user object type
 */
export interface MockUser {
  username: string;
  attributes: {
    email: string;
    sub: string;
    [key: string]: any;
  };
}

/**
 * Creates a mock user object
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    username: 'testuser',
    attributes: {
      email: 'test@example.com',
      sub: 'test-user-id',
      ...(overrides.attributes || {}),
    },
    ...overrides,
  };
}

/**
 * Mock authentication options for testing
 */
export interface MockAuthOptions {
  isAuthenticated?: boolean;
  user?: MockUser;
  mockSignIn?: 'success' | 'error' | 'configError';
  mockSignUp?: 'success' | 'error' | 'configError';
  mockConfirmSignUp?: 'success' | 'error';
}

/**
 * Sets up authentication mocks for testing
 */
export function setupAuthMocks(options: MockAuthOptions = {}): void {
  const {
    isAuthenticated = false,
    user = createMockUser(),
    mockSignIn = 'success',
    mockSignUp = 'success',
    mockConfirmSignUp = 'success',
  } = options;

  // Mock getCurrentUser
  (authModule.getCurrentUser as jest.Mock).mockResolvedValue(isAuthenticated ? user : null);

  // Mock signIn based on option
  if (mockSignIn === 'success') {
    (authModule.signIn as jest.Mock).mockResolvedValue(user);
  } else if (mockSignIn === 'error') {
    (authModule.signIn as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));
  } else if (mockSignIn === 'configError') {
    (authModule.signIn as jest.Mock).mockRejectedValue(
      new Error('Authentication service configuration error. Please contact support with error code: USER_POOL_CLIENT_ERROR')
    );
  }

  // Mock signUp based on option
  if (mockSignUp === 'success') {
    (authModule.signUp as jest.Mock).mockResolvedValue({ isSignUpComplete: false, nextStep: 'CONFIRM_SIGN_UP' });
  } else if (mockSignUp === 'error') {
    (authModule.signUp as jest.Mock).mockRejectedValue(new Error('This email is already registered. Please sign in instead.'));
  } else if (mockSignUp === 'configError') {
    (authModule.signUp as jest.Mock).mockRejectedValue(
      new Error('Authentication service configuration error. Please contact support with error code: USER_POOL_CLIENT_ERROR')
    );
  }

  // Mock confirmSignUp based on option
  if (mockConfirmSignUp === 'success') {
    (authModule.confirmSignUp as jest.Mock).mockResolvedValue(true);
  } else if (mockConfirmSignUp === 'error') {
    (authModule.confirmSignUp as jest.Mock).mockRejectedValue(new Error('Invalid verification code. Please try again.'));
  }

  // Always mock signOut to resolve successfully
  (authModule.signOut as jest.Mock).mockResolvedValue(undefined);

  // Mock getEnvConfig to return valid test values
  (authModule.getEnvConfig as jest.Mock).mockReturnValue({
    Auth: {
      Cognito: {
        userPoolId: 'mock-user-pool-id',
        userPoolClientId: 'mock-client-id'
      }
    }
  });
}

/**
 * Props for rendering with router and auth context
 */
export interface RenderWithAuthOptions extends RenderOptions {
  initialEntries?: MemoryRouterProps['initialEntries'];
  initialIndex?: MemoryRouterProps['initialIndex'];
  authOptions?: MockAuthOptions;
}

/**
 * Renders a component with router and auth context
 */
export function renderWithAuth(ui: React.ReactElement, options: RenderWithAuthOptions = {}) {
  const {
    initialEntries = ['/'],
    initialIndex = 0,
    authOptions = {},
    ...renderOptions
  } = options;

  // Setup auth mocks based on provided options
  setupAuthMocks(authOptions);

  // Helper to wrap component with all necessary providers
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // Use React.createElement instead of JSX to avoid TypeScript errors in .ts files
    return React.createElement(
      MemoryRouter,
      { initialEntries, initialIndex },
      children
    );
  };

  // Return the render result with the provided wrapper
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
