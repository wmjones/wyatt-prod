import { Amplify, Auth as AmplifyAuth } from 'aws-amplify';
import { ResourcesConfig } from 'aws-amplify';

// Get configuration from environment variables (set during build)
const getEnvConfig = (): ResourcesConfig => {
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

  // Simple way to merge configs
  Amplify.configure(defaultConfig);

  // Apply any additional provided config
  if (Object.keys(providedConfig).length > 0) {
    Amplify.configure(providedConfig);
  }

  // Log configuration in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Amplify configured with:', JSON.stringify({
      userPoolId: defaultConfig.Auth?.Cognito?.userPoolId,
      apiEndpoint: defaultConfig.API?.REST?.api?.endpoint,
    }, null, 2));
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
    const user = await AmplifyAuth.currentAuthenticatedUser();
    return {
      username: user.username,
      attributes: user.attributes,
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

  // For production use Cognito
  const user = await AmplifyAuth.signIn(username, password);
  return {
    username: user.username,
    attributes: user.attributes || { email: username, sub: user.userSub || '' },
  };
};

// Sign out helper function
export const signOut = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  // For production
  await AmplifyAuth.signOut();
};
