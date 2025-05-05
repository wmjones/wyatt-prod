import React from 'react';
import { render, screen } from '../../test-utils/testing-library-utils';
import ErrorPage from '../ErrorPage';

describe('ErrorPage Component', () => {
  it('renders the error heading', () => {
    render(<ErrorPage />);
    expect(screen.getByText('ERROR 404')).toBeInTheDocument();
  });

  it('renders the error message', () => {
    render(<ErrorPage />);
    expect(screen.getByText('Oops! Looks like this page got lost in cyberspace.')).toBeInTheDocument();
  });

  it('renders the shrug emoticon', () => {
    render(<ErrorPage />);
    expect(screen.getByText('¯\\_(ツ)_/¯')).toBeInTheDocument();
  });

  it('renders the home link', () => {
    render(<ErrorPage />);

    const homeLink = screen.getByRole('link', { name: /return home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders all decorative elements', () => {
    const { container } = render(<ErrorPage />);

    // Check for the zigzag element
    const zigzag = container.querySelector('.zigzag');
    expect(zigzag).toBeInTheDocument();

    // Check for the colored bars at the bottom
    const colorBars = container.querySelectorAll('.grid > div');
    expect(colorBars.length).toBe(4);
  });

  it('applies retro styling to the card', () => {
    const { container } = render(<ErrorPage />);

    // Check for the retro card class
    const retroCard = container.querySelector('.retro-card');
    expect(retroCard).toBeInTheDocument();

    // Check for the retro button class
    const retroButton = container.querySelector('.retro-button');
    expect(retroButton).toBeInTheDocument();
  });
});
