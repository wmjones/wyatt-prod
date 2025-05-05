import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupD3RefMock, simulateD3MouseHover, simulateD3MouseLeave } from '../../../test-utils/d3-test-utils';
import { createD3Mock } from '../../../test-utils/d3-test-utils';

// Import component after mocking
import NormalDistribution from '../NormalDistribution';

// Mock D3 using our utility
jest.mock('d3', () => createD3Mock());

describe('NormalDistribution Component', () => {
  const defaultProps = {
    mean: 0,
    stdDev: 1,
    width: 600,
    height: 300,
    updatedBy: 'Test User'
  };

  beforeEach(() => {
    // Set up D3 mocking before each test
    setupD3RefMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Basic rendering
  it('renders the visualization and metadata correctly', () => {
    render(<NormalDistribution {...defaultProps} />);

    // Verify SVG is rendered
    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toBeInTheDocument();

    // Verify user-visible metadata
    expect(screen.getByText(/Last updated by: Test User/i)).toBeInTheDocument();
  });

  // Test 2: Different props change what the user sees
  it('shows different visualization parameters based on props', () => {
    const { rerender } = render(<NormalDistribution {...defaultProps} />);
    expect(screen.getByText(/Last updated by: Test User/i)).toBeInTheDocument();

    // Update with different props
    const newProps = {
      ...defaultProps,
      mean: 5,
      stdDev: 2,
      updatedBy: 'Another User'
    };

    rerender(<NormalDistribution {...newProps} />);

    // Verify updated attribution is displayed
    expect(screen.getByText(/Last updated by: Another User/i)).toBeInTheDocument();

    // We don't test the actual D3 implementation details, but we can verify
    // that the component renders without errors with new parameters
  });

  // Test 3: Component lifecycle
  it('handles mount and unmount cleanly', () => {
    const { unmount } = render(<NormalDistribution {...defaultProps} />);
    unmount();
    // No assertion needed - just checking that unmount doesn't throw
  });

  // Test 4: Test hover state behavior (user interaction)
  // This test simulates user hovering over the visualization
  it('displays hover information when user hovers over the chart', async () => {
    const { container } = render(<NormalDistribution {...defaultProps} />);

    // Simulate hovering over the visualization
    simulateD3MouseHover('.overlay', 300, 150, container);

    // Wait for any asynchronous updates
    await waitFor(() => {
      // Check that tooltip content appears somewhere in the document
      // Using loose text queries since tooltip positions can vary
      expect(screen.getByText(/Value:/i)).toBeInTheDocument();
      expect(screen.getByText(/Density:/i)).toBeInTheDocument();
    });

    // Simulate mouse leave
    simulateD3MouseLeave('.overlay', container);

    // Tooltip should disappear (there could be multiple elements matching these texts)
    // - we're using a different approach to check tooltip visibility
    // - This is testing behavior, not implementation
    const tooltipElement = container.querySelector('.tooltip');
    expect(tooltipElement).toHaveStyle('opacity: 0');
  });
});
