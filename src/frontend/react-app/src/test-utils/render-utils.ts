import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

/**
 * Type combining render result with user-event for easier testing
 */
export interface RenderWithUserResult extends RenderResult {
  user: UserEvent;
}

/**
 * Utility function to wait for a specific amount of time
 * Sometimes needed for components with timeouts or debounce
 *
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after specified time
 */
export const waitMs = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Utility to generate test IDs with consistent format
 *
 * @param component Component name
 * @param element Element name
 * @returns Formatted test ID string
 */
export const testId = (component: string, element: string): string => {
  return `${component}-${element}`.toLowerCase();
};

/**
 * Helper to check if an element is visible in the viewport
 *
 * @param element The DOM element to check
 * @returns Boolean indicating if element is visible
 */
export const isElementInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Helper to create a mock response object
 *
 * @param data The data to include in the response
 * @param status HTTP status code
 * @returns Mocked response object
 */
export const createMockResponse = <T>(data: T, status = 200) => {
  return {
    data,
    status,
    ok: status >= 200 && status < 300,
    statusText: status === 200 ? 'OK' : `Error ${status}`,
    headers: new Headers({ 'Content-Type': 'application/json' }),
  };
};

/**
 * Helper to simulate form field validation errors
 *
 * @param field The field to check
 * @param message Error message
 */
export const simulateFieldValidationError = (
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  message: string
): void => {
  field.setCustomValidity(message);
  field.reportValidity();
};

/**
 * Helper to clear field validation errors
 *
 * @param field The field to clear validation for
 */
export const clearFieldValidationError = (
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): void => {
  field.setCustomValidity('');
};
