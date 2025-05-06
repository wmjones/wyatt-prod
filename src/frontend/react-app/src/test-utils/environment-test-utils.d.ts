/**
 * Type definitions for environment testing utilities
 */

import { SpyInstance } from 'jest';
import * as environmentModule from '../utils/environment';

/**
 * Mock the environment as development
 * @returns Jest spy instance to manage the mock
 */
export function mockDevelopmentEnvironment(): SpyInstance;

/**
 * Mock the environment as production
 * @returns Jest spy instance to manage the mock
 */
export function mockProductionEnvironment(): SpyInstance;

/**
 * Mock specific environment function with custom value
 * @param functionName The environment function to mock
 * @param value The return value for the function
 * @returns Jest spy instance to manage the mock
 */
export function mockEnvironmentFunction<T extends keyof typeof environmentModule>(
  functionName: T,
  value: boolean | string
): SpyInstance;

/**
 * Reset all environment mocks
 */
export function resetEnvironmentMocks(): void;
