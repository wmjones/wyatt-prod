import { Amplify } from 'aws-amplify';
import { fetchAuthSession, getCurrentUser as getAmplifyCurrentUser } from 'aws-amplify/auth';

// Define types for Amplify configuration
interface AmplifyConfig {
  Cognito?: {
    userPoolId?: string;
    userPoolClientId?: string;
    region?: string;
  };
  API?: {
    REST?: {
      [key: string]: {
        endpoint?: string;
        region?: string;
      };
    };
  };
}

// Get configuration from environment variables (set during build)
const getEnvConfig = (): AmplifyConfig => {
  return {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_xxxxxxxx',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      region: process.env.REACT_APP_REGION || 'us-east-1',
    },
    API: {
      REST: {
        api: {
          endpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com',
          region: process.env.REACT_APP_REGION || 'us-east-1',
        },
      },
    },
  };
};

// Initialize Amplify with configuration
export const configureAmplify = (config: AmplifyConfig = {}) => {
  // Default configuration from environment variables
  const defaultConfig = getEnvConfig();

  // Merge the default config with the provided config
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    Cognito: {
      ...defaultConfig.Cognito,
      ...(config.Cognito || {}),
    },
    API: {
      ...defaultConfig.API,
      ...(config.API || {}),
    },
  };

  // Configure Amplify with the merged config
  Amplify.configure(mergedConfig);

  // Log configuration in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Amplify configured with:', JSON.stringify({
      userPoolId: mergedConfig.Cognito?.userPoolId,
      region: mergedConfig.Cognito?.region,
      apiEndpoint: mergedConfig.API?.REST?.api?.endpoint,
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
  try {
    // In a real implementation, we would use AWS Amplify v6 auth functions
    // const currentUser = await getAmplifyCurrentUser();
    // const session = await fetchAuthSession();
    // return {
    //   username: currentUser.username,
    //   attributes: currentUser.attributes,
    // };

    // For demo purposes, we'll return a mock user
    return {
      username: 'demo-user',
      attributes: {
        email: 'demo@example.com',
        sub: '123456789',
      },
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
