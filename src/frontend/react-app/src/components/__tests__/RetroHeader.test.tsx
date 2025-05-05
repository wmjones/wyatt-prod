import React from 'react';
import { render, screen } from '../../test-utils/testing-library-utils';
import RetroHeader from '../RetroHeader';

describe('RetroHeader Component', () => {
  it('renders with title only', () => {
    render(<RetroHeader title="Test Title" />);

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('pixel-text', 'text-shadow');

    // Subtitle should not be present
    const subtitleElements = screen.queryByText(/_/);
    expect(subtitleElements).not.toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(<RetroHeader title="Test Title" subtitle="Test Subtitle" />);

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();

    const subtitleElement = screen.getByText(/Test Subtitle/);
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement).toHaveClass('retro-text', 'text-retro-teal');

    // The blinking underscore should be present
    const blinkElement = screen.getByText('_');
    expect(blinkElement).toBeInTheDocument();
    expect(blinkElement).toHaveClass('animate-blink');
  });

  it('includes decorative elements', () => {
    render(<RetroHeader title="Test Title" />);

    // Check for the gradient divider using Testing Library queries
    const divider = screen.getByTestId('gradient-divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('bg-gradient-to-r', 'from-retro-pink', 'via-retro-purple', 'to-retro-teal');
  });

  it('applies animations correctly', () => {
    render(<RetroHeader title="Test Title" subtitle="Test Subtitle" />);

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('animate-bounce-slow');

    const blinkElement = screen.getByText('_');
    expect(blinkElement).toHaveClass('animate-blink');
  });

  it('uses the appropriate responsive classes', () => {
    render(<RetroHeader title="Test Title" subtitle="Test Subtitle" />);

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('text-4xl', 'md:text-6xl');

    const subtitleElement = screen.getByText(/Test Subtitle/);
    expect(subtitleElement).toHaveClass('text-2xl', 'md:text-3xl');
  });
});
