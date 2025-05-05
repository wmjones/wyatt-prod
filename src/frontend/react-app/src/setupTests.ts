// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Import the MSW server
import { server } from './mocks/server';

// Silence React 18 warnings about useEffect & act in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
    /Warning: React Router Future Flag/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that may be added during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
