/**
 * Environment-related utility functions
 * These make our environment checks more testable
 */

/**
 * Check if the application is running in development mode
 * @returns boolean indicating if in development environment
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Check if the application is running in production mode
 * @returns boolean indicating if in production environment
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Check if the application is running in test mode
 * @returns boolean indicating if in test environment
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

/**
 * Get the current environment
 * @returns The current NODE_ENV value
 */
export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};
