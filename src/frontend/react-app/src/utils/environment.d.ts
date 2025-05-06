/**
 * Type definitions for environment utility functions
 */

/**
 * Check if the application is running in development mode
 * @returns boolean indicating if in development environment
 */
export function isDevelopment(): boolean;

/**
 * Check if the application is running in production mode
 * @returns boolean indicating if in production environment
 */
export function isProduction(): boolean;

/**
 * Check if the application is running in test mode
 * @returns boolean indicating if in test environment
 */
export function isTest(): boolean;

/**
 * Get the current environment
 * @returns The current NODE_ENV value
 */
export function getEnvironment(): string;

/**
 * Environment type for type checking
 */
export type Environment = 'development' | 'production' | 'test';
