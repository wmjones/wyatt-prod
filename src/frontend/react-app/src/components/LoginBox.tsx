import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { AuthState, User, getCurrentUser, signIn, signOut } from '../utils/auth';

const LoginBox: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.SignIn);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Check for existing user session on component mount
  useEffect(() => {
    checkUserAuth();
  }, []);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if user is authenticated
  const checkUserAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setAuthState(AuthState.SignedIn);
      }
    } catch (error) {
      console.log('No authenticated user found');
    }
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await signIn(email, password);
      setUser(user);
      setAuthState(AuthState.SignedIn);

      // Clear form fields
      setEmail('');
      setPassword('');

      // Log successful login
      console.log('User signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setAuthState(AuthState.SignIn);
      setShowDropdown(false);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle switching to sign up form
  const handleSwitchToSignUp = () => {
    setAuthState(AuthState.SignUp);
    setError('');
  };

  // Handle switching to forgot password form
  const handleSwitchToForgotPassword = () => {
    setAuthState(AuthState.ForgotPassword);
    setError('');
  };

  // Handle switching back to sign in form
  const handleSwitchToSignIn = () => {
    setAuthState(AuthState.SignIn);
    setError('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Render sign in form
  const renderSignInForm = () => {
    return (
      <form onSubmit={handleSignIn} className="space-y-3">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            retro
            className="w-full mb-2"
            aria-label="Email"
          />
        </div>

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            retro
            className="w-full pr-10"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs mono-text"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center mono-text cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-1 retro-text"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={handleSwitchToForgotPassword}
            className="mono-text text-retro-purple underline"
          >
            Forgot password?
          </button>
        </div>

        {error && <div className="text-retro-pink text-xs mono-text">{error}</div>}

        <Button
          type="submit"
          variant="retro"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </Button>

        <div className="text-center text-xs mono-text">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={handleSwitchToSignUp}
            className="text-retro-purple underline"
          >
            Sign up
          </button>
        </div>
      </form>
    );
  };

  // Render the logged-in state
  const renderLoggedInState = () => {
    return (
      <div className="space-y-3">
        <div className="text-center mb-2">
          <div className="mono-text text-sm">Logged in as</div>
          <div className="retro-text text-lg text-retro-purple">{user?.attributes.email || user?.username}</div>
        </div>

        <Button
          variant="retro"
          className="w-full"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? 'LOGGING OUT...' : 'LOGOUT'}
        </Button>
      </div>
    );
  };

  // Render the dropdown container
  const renderDropdownContainer = () => {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center retro-button px-3 py-1 text-sm"
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          {user ? (
            <span className="truncate max-w-[100px]">{user.username}</span>
          ) : (
            <span>LOGIN</span>
          )}
        </button>

        {/* Dropdown content */}
        {showDropdown && (
          <Card
            retro
            className="absolute right-0 mt-2 w-64 z-50 animate-in fade-in"
          >
            <CardContent className="p-4">
              {authState === AuthState.SignedIn ? renderLoggedInState() : renderSignInForm()}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Render responsive login box
  return (
    <div className="absolute top-4 right-4 z-10">
      {renderDropdownContainer()}
    </div>
  );
};

export default LoginBox;
