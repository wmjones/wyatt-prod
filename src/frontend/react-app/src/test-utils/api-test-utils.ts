import { server } from '../mocks/server';
import { rest } from 'msw';

/**
 * Utility function to override MSW handlers for a specific test
 * @param path API path to override
 * @param method HTTP method (get, post, etc.)
 * @param responseData Data to return in the response
 * @param status HTTP status code
 */
export const mockApiResponse = (
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  responseData: any,
  status = 200
) => {
  // Create a handler for the specified method
  const handler = rest[method](
    path,
    (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json(responseData)
      );
    }
  );

  // Use MSW to override the default handler
  server.use(handler);
};

/**
 * Utility function to simulate API error responses
 * @param path API path to override
 * @param method HTTP method
 * @param status HTTP error status code
 * @param errorData Optional error data
 */
export const mockApiError = (
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  status = 500,
  errorData = { message: 'An error occurred' }
) => {
  // Create an error handler
  const handler = rest[method](
    path,
    (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json(errorData)
      );
    }
  );

  // Use MSW to override the default handler
  server.use(handler);
};

/**
 * Utility function to simulate network failures
 * @param path API path to override
 * @param method HTTP method
 */
export const mockNetworkError = (
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
) => {
  // Create a handler that simulates a network error
  const handler = rest[method](
    path,
    (req, res, ctx) => {
      return res(
        ctx.status(503),
        ctx.json({ message: 'Network Error' })
      );
    }
  );

  // Use MSW to override the default handler
  server.use(handler);
};

/**
 * Reset all handlers to the default handlers
 */
export const resetHandlers = () => {
  server.resetHandlers();
};

/**
 * Utility function to delay API responses (useful for testing loading states)
 * @param path API path to override
 * @param method HTTP method
 * @param responseData Data to return in the response
 * @param delayMs Delay in milliseconds
 * @param status HTTP status code
 */
export const mockDelayedResponse = (
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  responseData: any,
  delayMs = 1000,
  status = 200
) => {
  const handler = rest[method](
    path,
    async (req, res, ctx) => {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return res(
        ctx.status(status),
        ctx.json(responseData)
      );
    }
  );

  server.use(handler);
};
