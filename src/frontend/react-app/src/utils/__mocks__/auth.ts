/**
 * Mock implementation of authentication module for testing
 *
 * This module mocks the auth.ts functionality to allow for unit testing
 * without actual AWS Amplify authentication calls.
 *
 * Usage in tests:
 * 1. Automatic import: Jest automatically uses this mock when importing from '../utils/auth'
 * 2. Manual mock setup: jest.mock('../utils/auth') in your test file
 * 3. Configure behavior: Use the exported mock functions to set up test scenarios
 */

import { AuthState, User } from '../auth';

// Mock implementation of Amplify authentication API
const mockAmplifyAuth = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn()
};

// Default mock user for tests
const DEFAULT_MOCK_USER: User = {
  username: 'test-user',
  attributes: {
    email: 'test@example.com',
    sub: 'test-user-id',
    name: 'Test User'
  }
};

// Default mock config for tests
const DEFAULT_MOCK_CONFIG = {
  Auth: {
    Cognito: {
      userPoolId: 'test-user-pool-id',
      userPoolClientId: 'test-client-id',
      loginWith: {
        email: true
      }
    }
  },
  API: {
    REST: {
      api: {
        endpoint: 'https://test-api.example.com'
      }
    }
  }
};

// Shared mutable state for auth module
let authState = {
  isAuthenticated: false,
  user: null as User | null,
  mockSignInResult: 'success' as 'success' | 'error' | 'configError',
  mockSignUpResult: 'success' as 'success' | 'error',
  mockConfirmSignUpResult: 'success' as 'success' | 'error'
};

/**
 * Reset the authentication state for testing
 * This should be called in beforeEach() to ensure clean tests
 */
export const resetAuthState = () => {
  authState = {
    isAuthenticated: false,
    user: null,
    mockSignInResult: 'success',
    mockSignUpResult: 'success',
    mockConfirmSignUpResult: 'success'
  };
};

/**
 * Set authentication state for testing
 * @param options Authentication state options
 */
export const setAuthState = (options: {
  isAuthenticated?: boolean;
  user?: User | null;
  mockSignInResult?: 'success' | 'error' | 'configError';
  mockSignUpResult?: 'success' | 'error';
  mockConfirmSignUpResult?: 'success' | 'error';
}) => {
  authState = {
    ...authState,
    ...options
  };
};

// Mock implementation of getEnvConfig
export const getEnvConfig = jest.fn().mockImplementation(() => DEFAULT_MOCK_CONFIG);

// Mock implementation of configureAmplify
export const configureAmplify = jest.fn();

// Mock implementation of getCurrentUser
export const getCurrentUser = jest.fn().mockImplementation(async () => {
  if (!authState.isAuthenticated) {
    return null;
  }
  return authState.user || DEFAULT_MOCK_USER;
});

// Mock implementation of signIn
export const signIn = jest.fn().mockImplementation(async (username: string, password: string) => {
  switch (authState.mockSignInResult) {
    case 'error':
      throw new Error('Invalid email or password');

    case 'configError':
      throw new Error('Authentication service configuration error. Please contact support with error code: USER_POOL_CLIENT_ERROR');

    case 'success':
    default:
      authState.isAuthenticated = true;
      authState.user = {
        username,
        attributes: {
          email: username,
          sub: 'mock-sub-id',
          name: username.split('@')[0]
        }
      };
      return authState.user;
  }
});

// Mock implementation of signUp
export const signUp = jest.fn().mockImplementation(async (
  username: string,
  password: string,
  email: string,
  name?: string
) => {
  if (authState.mockSignUpResult === 'error') {
    throw new Error('This email is already registered. Please sign in instead.');
  }

  return {
    isSignUpComplete: false,
    nextStep: 'CONFIRM_SIGN_UP',
    userSub: 'mock-user-sub'
  };
});

// Mock implementation of confirmSignUp
export const confirmSignUp = jest.fn().mockImplementation(async (
  username: string,
  confirmationCode: string
) => {
  if (authState.mockConfirmSignUpResult === 'error') {
    throw new Error('Invalid verification code. Please try again.');
  }

  return true;
});

// Mock implementation of signOut
export const signOut = jest.fn().mockImplementation(async () => {
  authState.isAuthenticated = false;
  authState.user = null;
  return undefined;
});

// Export AuthState enum
export { AuthState };
