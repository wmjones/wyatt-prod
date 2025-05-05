import React from 'react';
import { render, screen } from '../../test-utils/testing-library-utils';
import RetroFooter from '../RetroFooter';

describe('RetroFooter Component', () => {
  beforeEach(() => {
    // Mock new Date() to return a fixed date for consistent testing
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2025-04-01').valueOf());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the footer with all sections', () => {
    render(<RetroFooter />);

    // Navigation section
    expect(screen.getByText('NAVIGATION')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Demo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();

    // Resources section
    expect(screen.getByText('RESOURCES')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'D3.js' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'AWS' })).toBeInTheDocument();

    // Connect section
    expect(screen.getByText('CONNECT')).toBeInTheDocument();
    expect(screen.getByText('Join our retro visualization community!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chat' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Phone' })).toBeInTheDocument();
  });

  it('displays the current year in the copyright notice', () => {
    render(<RetroFooter />);

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Check if the copyright text contains the current year
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('contains the Netscape Navigator easter egg', () => {
    render(<RetroFooter />);

    expect(screen.getByText(/Best viewed with Netscape Navigator/i)).toBeInTheDocument();
  });

  it('applies retro styling to headings', () => {
    render(<RetroFooter />);

    const headings = screen.getAllByText(/NAVIGATION|RESOURCES|CONNECT/);

    headings.forEach(heading => {
      expect(heading).toHaveClass('retro-text', 'text-retro-teal');
    });
  });

  it('includes correct links with proper attributes', () => {
    render(<RetroFooter />);

    // Check external links have proper attributes
    const d3Link = screen.getByRole('link', { name: 'D3.js' });
    expect(d3Link).toHaveAttribute('href', 'https://d3js.org/');
    expect(d3Link).toHaveAttribute('target', '_blank');
    expect(d3Link).toHaveAttribute('rel', 'noopener noreferrer');

    // Check internal links
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    // Check email link
    const emailLink = screen.getByRole('link', { name: 'Email' });
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@example.com');
  });
});
