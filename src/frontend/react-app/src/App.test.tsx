import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Remove the Router from App in tests to avoid nesting issues
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

test('renders the app without crashing', () => {
  render(
    <MemoryRouter future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true // Add this flag to address Future Flag Warning
    }}>
      <App />
    </MemoryRouter>
  );
  // Just verify that rendering succeeds without errors
  expect(document.body).toBeInTheDocument();
});
