import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

/**
 * Minimal, user-centric button tests
 *
 * These tests focus on:
 * 1. What the user sees (text, visual state)
 * 2. What happens when the user interacts with the button
 * 3. Accessibility features
 *
 * We avoid testing implementation details like specific class names
 * or internal component state.
 */
describe('Button Component', () => {
  // Test 1: Basic rendering and interaction
  it('renders with text and responds to clicks', async () => {
    // Arrange
    const handleClick = jest.fn();
    const user = userEvent.setup();

    // Act
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    // Assert - First check what the user sees
    expect(button).toBeInTheDocument();

    // Act - User interaction
    await user.click(button);

    // Assert - Check the result of the interaction
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 2: Disabled state
  it('shows disabled state and prevents clicks when disabled', async () => {
    // Arrange
    const handleClick = jest.fn();
    const user = userEvent.setup();

    // Act
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });

    // Assert - Check visual state (what user sees)
    expect(button).toBeDisabled();

    // Act - Try to click the disabled button
    await user.click(button);

    // Assert - Verify the click was prevented
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 3: Different button variants (visual test)
  it('renders different visual variants', () => {
    // We're testing what's visually different to the user
    // but not the specific implementation (class names)

    // Arrange & Act
    const { rerender } = render(<Button variant="destructive">Delete</Button>);

    // Assert - Check that the button is rendered
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();

    // Test other variants - just checking they render without errors
    const variants = ['outline', 'secondary', 'ghost', 'link', 'retro'];

    variants.forEach(variant => {
      rerender(<Button variant={variant as any}>{variant} Button</Button>);
      expect(screen.getByRole('button', { name: new RegExp(`${variant} button`, 'i') })).toBeInTheDocument();
    });
  });

  // Test 4: Accessibility - focuses correctly
  it('can receive focus and responds to keyboard', async () => {
    // Arrange
    const handleClick = jest.fn();
    const user = userEvent.setup();

    // Act
    render(<Button onClick={handleClick}>Press me</Button>);
    const button = screen.getByRole('button', { name: /press me/i });

    // Focus the button (user tabbing to it)
    button.focus();

    // Assert - Check it received focus
    expect(button).toHaveFocus();

    // Act - Press Enter key (common accessibility interaction)
    await user.keyboard('{Enter}');

    // Assert - Check the button responded to keyboard
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
