import React from 'react';
import { render, screen, waitFor } from '../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import LoginBox from '../LoginBox';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp } from '../../utils/auth';

// Mock the auth utilities
jest.mock('../../utils/auth', () => ({
  AuthState: {
    SignIn: 'signIn',
    SignUp: 'signUp',
    ConfirmSignUp: 'confirmSignUp',
    ForgotPassword: 'forgotPassword',
    SignedIn: 'signedIn'
  },
  getCurrentUser: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  getEnvConfig: jest.fn().mockReturnValue({
    Auth: {
      Cognito: {
        userPoolId: 'mock-user-pool-id',
        userPoolClientId: 'mock-client-id'
      }
    }
  })
}));

describe('LoginBox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock that user is not authenticated initially
    (getCurrentUser as jest.Mock).mockResolvedValue(null);
  });

  it('renders the login dropdown button', () => {
    render(<LoginBox />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('opens the login form when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginBox />);

    // Click the login button
    const loginButton = screen.getByTestId('login-box-toggle');
    await user.click(loginButton);

    // Check that the form appears
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Find the submit button by getting all buttons and filtering by type attribute
    const allButtons = screen.getAllByRole('button');
    const submitButton = allButtons.find(btn => btn.getAttribute('type') === 'submit');
    expect(submitButton).toBeTruthy();
    expect(submitButton?.textContent).toBe('LOGIN');
  });

  it('switches to sign up form when "Sign up" is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByTestId('login-box-toggle'));

    // Click on sign up link
    await user.click(screen.getByTestId('sign-up-link'));

    // Check that sign up form is displayed
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up$/i })).toBeInTheDocument();
  });

  it('shows error when passwords do not match during sign up', async () => {
    const user = userEvent.setup();
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByTestId('login-box-toggle'));

    // Switch to sign up
    await user.click(screen.getByTestId('sign-up-link'));

    // Fill the form with non-matching passwords
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password456');

    // Submit the form
    await user.click(screen.getByTestId('sign-up-submit-button'));

    // Check for error message
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('shows error when password is too short during sign up', async () => {
    const user = userEvent.setup();
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByTestId('login-box-toggle'));

    // Switch to sign up
    await user.click(screen.getByTestId('sign-up-link'));

    // Fill the form with short password
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'short');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'short');

    // Submit the form
    await user.click(screen.getByTestId('sign-up-submit-button'));

    // Check for error message
    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
  });

  it('submits sign up form with valid data', async () => {
    // Mock successful sign up
    (signUp as jest.Mock).mockResolvedValue({ isSignUpComplete: false });

    const user = userEvent.setup();
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByTestId('login-box-toggle'));

    // Switch to sign up
    await user.click(screen.getByTestId('sign-up-link'));

    // Fill the form with valid data
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'validpassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'validpassword123');

    // Submit the form
    await user.click(screen.getByTestId('sign-up-submit-button'));

    // Wait for the async call to resolve
    await waitFor(() => {
      // Check that signUp was called with the right parameters
      expect(signUp).toHaveBeenCalledWith(
        'test@example.com',
        'validpassword123',
        'test@example.com',
        'test'
      );
    });

    // Check that we moved to the verification step
    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
  });

  it('submits verification code successfully', async () => {
    // Mock successful confirmation
    (confirmSignUp as jest.Mock).mockResolvedValue(true);

    const user = userEvent.setup();

    // Start at confirmation state
    (signUp as jest.Mock).mockResolvedValue({ isSignUpComplete: false });
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByTestId('login-box-toggle'));

    // Switch to sign up
    await user.click(screen.getByTestId('sign-up-link'));

    // Fill the form with valid data
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'validpassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'validpassword123');

    // Submit the sign up form
    await user.click(screen.getByRole('button', { name: /sign up$/i }));

    // Now we should be in the verification step
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Verification Code')).toBeInTheDocument();
    });

    // Enter verification code
    await user.type(screen.getByPlaceholderText('Verification Code'), '123456');

    // Submit the verification form
    await user.click(screen.getByTestId('verify-submit-button'));

    // Check that confirmSignUp was called
    await waitFor(() => {
      expect(confirmSignUp).toHaveBeenCalledWith('test@example.com', '123456');
    });

    // Check that we're back to sign in
    expect(screen.getByText(/account confirmed successfully/i)).toBeInTheDocument();
  });

  it('handles sign in success', async () => {
    // Mock successful sign in
    const mockUser = { username: 'testuser', attributes: { email: 'test@example.com' } };
    (signIn as jest.Mock).mockResolvedValue(mockUser);

    const user = userEvent.setup();
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Fill the sign in form
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');

    // Use a more specific selector - directly get the submit button
    const submitButton = [...screen.getAllByRole('button')].find(
      btn => btn.getAttribute('type') === 'submit'
    );

    // Check that we found the button
    expect(submitButton).toBeTruthy();

    // Click the login submit button
    await user.click(screen.getByTestId('login-submit-button'));

    // Check that signIn was called
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Check that we're logged in
    expect(screen.getByText(/logged in as/i)).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('handles sign out', async () => {
    // Mock that user is authenticated
    const mockUser = { username: 'testuser', attributes: { email: 'test@example.com' } };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const user = userEvent.setup();
    render(<LoginBox />);

    // Wait for auto-login check
    await waitFor(() => {
      expect(getCurrentUser).toHaveBeenCalled();
    });

    // Open the dropdown - the button might have a different name in the UI
    // Let's use text content of the button which will have the username or 'LOGIN'
    const authButton = await screen.findByRole('button', { name: /login|testuser/i });
    await user.click(authButton);

    // After dropdown opens, look for logout
    const logoutButton = await screen.findByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Check that signOut was called
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginBox />);

    // Open the dropdown
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Check that password field is of type password
    const passwordField = screen.getByPlaceholderText('Password');
    expect(passwordField).toHaveAttribute('type', 'password');

    // Click show button
    await user.click(screen.getByRole('button', { name: /show password/i }));

    // Check that password field is now of type text
    expect(passwordField).toHaveAttribute('type', 'text');

    // Click hide button
    await user.click(screen.getByRole('button', { name: /hide password/i }));

    // Check that password field is back to type password
    expect(passwordField).toHaveAttribute('type', 'password');
  });
});
