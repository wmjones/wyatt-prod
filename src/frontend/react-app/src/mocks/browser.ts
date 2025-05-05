import { setupWorker } from 'msw';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Add a type handler for the window msw object used in index.tsx
declare global {
  interface Window {
    msw: {
      worker: typeof worker;
    };
  }
}
