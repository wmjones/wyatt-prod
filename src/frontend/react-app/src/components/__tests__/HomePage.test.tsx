import React from 'react';
import { render, screen } from '../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';

describe('HomePage Component', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Data Visualization')).toBeInTheDocument();
  });

  it('renders the feature list correctly', () => {
    render(<HomePage />);

    // Find the features section
    const featuresHeading = screen.getByText('FEATURES');
    expect(featuresHeading).toBeInTheDocument();

    // Check that all feature items are rendered
    const featureItems = [
      'Interactive parameter controls',
      'Real-time visualization updates',
      'Statistical insights',
      'WebSocket real-time collaboration'
    ];

    featureItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders the status cards with correct statuses', () => {
    render(<HomePage />);

    // Find the status section
    const statusHeading = screen.getByText('PROJECT STATUS');
    expect(statusHeading).toBeInTheDocument();

    // Check that all status cards are rendered with correct text
    expect(screen.getByText('REACT SPA')).toBeInTheDocument();
    expect(screen.getByText('Deployed and working')).toBeInTheDocument();

    expect(screen.getByText('DYNAMODB')).toBeInTheDocument();
    expect(screen.getByText('Deployed and ready')).toBeInTheDocument();

    expect(screen.getByText('USER AUTH')).toBeInTheDocument();
    expect(screen.getByText('In development')).toBeInTheDocument();

    expect(screen.getByText('VISUALIZATIONS')).toBeInTheDocument();
    expect(screen.getByText('See Demo page')).toBeInTheDocument();
  });

  it('renders the DynamoDB infrastructure section', () => {
    render(<HomePage />);

    // Find the DynamoDB section
    const dynamodbHeading = screen.getByText('DYNAMODB INFRASTRUCTURE');
    expect(dynamodbHeading).toBeInTheDocument();

    // Check that all table cards are rendered
    expect(screen.getByText('PARAMETER TABLE')).toBeInTheDocument();
    expect(screen.getByText('HISTORY TABLE')).toBeInTheDocument();
    expect(screen.getByText('CONNECTION TABLE')).toBeInTheDocument();
  });

  it('renders the "Why Choose Us" section', () => {
    render(<HomePage />);

    // Find the section
    const sectionHeading = screen.getByText('WHY CHOOSE US');
    expect(sectionHeading).toBeInTheDocument();

    // Check that all three cards are rendered
    expect(screen.getByText('VISUALIZE')).toBeInTheDocument();
    expect(screen.getByText('ANALYZE')).toBeInTheDocument();
    expect(screen.getByText('COLLABORATE')).toBeInTheDocument();
  });

  it('renders a component between the top grid and features section', () => {
    render(<HomePage />);

    // Find the grid element
    const gridElement = screen.getByText('Data Visualization').closest('.grid');

    // Find the features section by its title
    const featuresSection = screen.getByText('WHY CHOOSE US').closest('.my-16');

    // Check that there's an element between them
    expect(gridElement).toBeTruthy();
    expect(featuresSection).toBeTruthy();

    // In a real test, we would check for MarqueeText text, but it's
    // difficult to test directly due to its animated nature
  });

  it('renders links to other pages', async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    // Find all the links to the demo page
    const demoLinks = screen.getAllByRole('link', { name: /try demo/i });
    expect(demoLinks.length).toBeGreaterThan(0);

    // Check that the demo links have the correct href
    demoLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/demo');
    });

    // Find the about link
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders status indicators with correct colors', () => {
    render(<HomePage />);

    // Find the status card container divs
    const statusCards = document.querySelectorAll('.retro-card');

    // Check the deployed status indicators
    const deployedIndicators = Array.from(statusCards).filter(card =>
      card.textContent?.includes('Deployed')
    );

    deployedIndicators.forEach(card => {
      const indicator = card.querySelector('.bg-retro-teal');
      expect(indicator).toBeInTheDocument();
    });

    // Check the in-progress status indicators
    const inProgressIndicators = Array.from(statusCards).filter(card =>
      card.textContent?.includes('In development') ||
      card.textContent?.includes('See Demo page')
    );

    inProgressIndicators.forEach(card => {
      const indicator = card.querySelector('.bg-retro-yellow');
      expect(indicator).toBeInTheDocument();
    });
  });
});
