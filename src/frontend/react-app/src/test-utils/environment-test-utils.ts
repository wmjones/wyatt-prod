/**
 * Test utilities for mocking environment-related functions
 */
import * as environmentModule from '../utils/environment';

/**
 * Mock the environment as development
 */
export const mockDevelopmentEnvironment = (): jest.SpyInstance => {
  return jest.spyOn(environmentModule, 'isDevelopment').mockReturnValue(true);
};

/**
 * Mock the environment as production
 */
export const mockProductionEnvironment = (): jest.SpyInstance => {
  return jest.spyOn(environmentModule, 'isDevelopment').mockReturnValue(false);
};

/**
 * Mock specific environment function with custom value
 * @param functionName The environment function to mock
 * @param value The return value for the function
 */
export const mockEnvironmentFunction = (
  functionName: keyof typeof environmentModule,
  value: boolean | string
): jest.SpyInstance => {
  return jest.spyOn(environmentModule, functionName).mockImplementation(() => value);
};

/**
 * Reset all environment mocks
 */
export const resetEnvironmentMocks = (): void => {
  jest.restoreAllMocks();
};
