import { Amplify } from 'aws-amplify';
import { ResourcesConfig } from 'aws-amplify';
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  // AWS Amplify types are imported but not directly used
  // We use our own interface definitions for better compatibility
} from 'aws-amplify/auth';

/**
 * AWS Amplify v6 type extensions
 *
 * NOTE: The AWS Amplify v6 authentication response structure has changed significantly.
 * In Amplify v6, the CognitoAuthSignInDetails type doesn't have a userAttributes property directly.
 * Instead, attributes are accessed differently in the signInDetails object.
 *
 * This extension creates a predictable interface for accessing user attributes regardless of
 * how the underlying structure might change in Amplify updates.
 *
 * IMPORTANT: If upgrading AWS Amplify, review this code to ensure compatibility.
 */
interface ExtendedSignInDetails {
  /**
   * User attributes such as email, sub (user ID), and custom attributes.
   * In Amplify v6, these might be accessed differently depending on the auth flow.
   */
  userAttributes?: {
    email: string;
    sub: string;
    [key: string]: any;
  };

  /**
   * Allow for other properties that might exist in the signInDetails
   */
  [key: string]: any;
}

// Get configuration from environment variables (set during build)
export const getEnvConfig = (): ResourcesConfig => {
  return {
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_xxxxxxxx',
        userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
        loginWith: {
          email: true
        }
      }
    },
    API: {
      REST: {
        api: {
          endpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com'
        }
      }
    }
  };
};

// Initialize Amplify with configuration
export const configureAmplify = (providedConfig: Partial<ResourcesConfig> = {}) => {
  // Default configuration from environment variables
  const defaultConfig = getEnvConfig();

  // Check if we have valid Cognito configuration
  const userPoolId = defaultConfig.Auth?.Cognito?.userPoolId || '';
  const userPoolClientId = defaultConfig.Auth?.Cognito?.userPoolClientId || '';

  // Check if we have placeholder values (indicating real values weren't provided)
  const isPlaceholderUserPoolId = userPoolId.includes('xxxxxxxx');
  const isPlaceholderClientId = userPoolClientId.includes('xxxxxxxxxxxxxxxxxxxxxxxxxx');

  // Log configuration info
  console.log('Amplify configuration status:', {
    environment: process.env.NODE_ENV,
    stage: process.env.REACT_APP_STAGE || 'unknown',
    region: process.env.REACT_APP_REGION || 'unknown',
    hasValidUserPoolId: !isPlaceholderUserPoolId,
    hasValidClientId: !isPlaceholderClientId
  });

  // Simple way to merge configs
  Amplify.configure(defaultConfig);

  // Apply any additional provided config
  if (Object.keys(providedConfig).length > 0) {
    Amplify.configure(providedConfig);
  }

  // More detailed logging in development or if using placeholder values
  if (process.env.NODE_ENV === 'development' || isPlaceholderUserPoolId || isPlaceholderClientId) {
    console.log('Amplify configured with:', JSON.stringify({
      userPoolId: defaultConfig.Auth?.Cognito?.userPoolId,
      apiEndpoint: defaultConfig.API?.REST?.api?.endpoint,
    }, null, 2));

    if (isPlaceholderUserPoolId || isPlaceholderClientId) {
      console.warn('WARNING: Using placeholder values for Cognito configuration. Authentication will not work correctly.');
      console.warn('Please ensure the following environment variables are set correctly:');
      console.warn('- REACT_APP_USER_POOL_ID');
      console.warn('- REACT_APP_USER_POOL_CLIENT_ID');
      console.warn('Check that the store-terraform-outputs.sh script has been run after terraform apply.');
    }
  }
};

// Export type for AuthState
export enum AuthState {
  SignIn = 'signIn',
  SignUp = 'signUp',
  ConfirmSignUp = 'confirmSignUp',
  ForgotPassword = 'forgotPassword',
  VerifyContact = 'verifyContact',
  SignedIn = 'signedIn',
}

// Define the User interface
export interface User {
  username: string;
  attributes: {
    email: string;
    sub: string;
    [key: string]: any;
  };
}

// Helper function to get current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  // For demo purposes
  if (process.env.NODE_ENV === 'development') {
    // Return a mock user for development
    return {
      username: 'demo-user',
      attributes: {
        email: 'demo@example.com',
        sub: '123456789',
      },
    };
  }

  try {
    // For production, use actual Cognito authentication
    const { username, signInDetails } = await amplifyGetCurrentUser();

    // Extract user attributes safely with type assertions
    const extendedDetails = signInDetails as ExtendedSignInDetails;
    // Safely fallback to username if attributes aren't available
    const attributes = extendedDetails?.userAttributes ||
                      { email: username, sub: (signInDetails as any)?.sub || username || '' };

    return {
      username,
      attributes,
    };
  } catch (error) {
    console.log('No authenticated user found');
    return null;
  }
};

// Sign in helper function
export const signIn = async (
  username: string,
  password: string
): Promise<User> => {
  // For demo in development
  if (process.env.NODE_ENV === 'development') {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication for demo
    if (username === 'demo@example.com' && password === 'password') {
      return {
        username: 'demo-user',
        attributes: {
          email: username,
          sub: '123456789',
        }
      };
    }
    throw new Error('Invalid email or password');
  }

  // Check if we have valid Cognito configuration
  const config = getEnvConfig();
  const userPoolId = config.Auth?.Cognito?.userPoolId || '';
  const userPoolClientId = config.Auth?.Cognito?.userPoolClientId || '';

  const isPlaceholderUserPoolId = userPoolId.includes('xxxxxxxx');
  const isPlaceholderClientId = userPoolClientId.includes('xxxxxxxxxxxxxxxxxxxxxxxxxx');

  // If we're using placeholder values, provide a more helpful error message
  if (isPlaceholderUserPoolId || isPlaceholderClientId) {
    console.error('Authentication failed: Invalid Cognito configuration');
    throw new Error('Authentication service is not properly configured. Please contact support with error code: COGNITO_CONFIG_ERROR');
  }

  try {
    // For production use Cognito
    const { isSignedIn, nextStep } = await amplifySignIn({ username, password });

    if (isSignedIn) {
      const { username: user, signInDetails } = await amplifyGetCurrentUser();

      // Extract user attributes safely with type assertions
      const extendedDetails = signInDetails as ExtendedSignInDetails;
      // Safely fallback to username if attributes aren't available
      const attributes = extendedDetails?.userAttributes ||
                        { email: username, sub: (signInDetails as any)?.sub || username || '' };

      return {
        username: user,
        attributes,
      };
    }

    throw new Error(`Could not sign in. Next step: ${nextStep.signInStep}`);
  } catch (error) {
    // Handle specific Cognito error for user pool client not existing
    if (error instanceof Error && error.message.includes('User pool client')) {
      console.error('Authentication failed: User pool client error', error);
      throw new Error('Authentication service configuration error. Please contact support with error code: USER_POOL_CLIENT_ERROR');
    }

    // Re-throw other errors
    throw error;
  }
};

// Sign out helper function
export const signOut = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  // For production
  await amplifySignOut();
};
