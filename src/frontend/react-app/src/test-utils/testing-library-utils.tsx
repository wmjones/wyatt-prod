import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RenderWithUserResult } from './render-utils';

// Create a custom renderer that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true // Add this flag to address Future Flag Warning
    }}>
      {children}
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Custom render with user event setup
const renderWithUser = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderWithUserResult => {
  return {
    user: userEvent.setup(),
    ...customRender(ui, options)
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render methods
export { customRender as render, renderWithUser };
