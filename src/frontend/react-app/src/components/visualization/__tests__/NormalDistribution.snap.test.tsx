import React from 'react';
import renderer from 'react-test-renderer';
import { createD3Mock } from '../../../test-utils/d3-test-utils';

// Import component after mocking
import NormalDistribution from '../NormalDistribution';

// Mock D3 using our utility function
// Use direct mock instead of imported function
jest.mock('d3', () => ({
  select: jest.fn().mockReturnThis(),
  selectAll: jest.fn().mockReturnThis(),
  append: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  style: jest.fn().mockReturnThis(),
  text: jest.fn().mockReturnThis(),
  data: jest.fn().mockReturnThis(),
  enter: jest.fn().mockReturnThis(),
  exit: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  domain: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  scaleLinear: jest.fn().mockReturnValue({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    nice: jest.fn().mockReturnThis()
  }),
  axisBottom: jest.fn().mockReturnThis(),
  axisLeft: jest.fn().mockReturnThis(),
  line: jest.fn().mockReturnValue({
    x: jest.fn().mockReturnThis(),
    y: jest.fn().mockReturnThis(),
    curve: jest.fn().mockReturnThis()
  }),
  randomNormal: jest.fn().mockReturnValue(() => 0),
  curveBasis: {},
}));

/**
 * Minimal, focused snapshot tests for D3 visualizations
 *
 * These snapshots are kept minimal and focus only on the structure of the
 * component, not the full rendering details of the D3 visualization.
 * We're testing:
 * 1. The basic structure of the component
 * 2. That changing props updates the relevant user-visible information
 */
describe('NormalDistribution Component Snapshots', () => {
  // Mock React.useRef to avoid errors in snapshot tests
  beforeEach(() => {
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with default props', () => {
    const tree = renderer
      .create(<NormalDistribution />)
      .toJSON();

    // Use a more consistent serialization approach by directly using the snapshot
    // Instead of JSON.parse(JSON.stringify()) which can cause format differences
    expect(tree).toMatchSnapshot();
  });

  it('renders with custom attribution', () => {
    const tree = renderer
      .create(<NormalDistribution updatedBy="Custom User" />)
      .toJSON();

    // Use a more consistent serialization approach by directly using the snapshot
    expect(tree).toMatchSnapshot();
  });

  // We only need 2 snapshot tests:
  // 1. Default rendering - the basic component structure
  // 2. Customized rendering - changing the user-visible elements
  // This avoids brittle, excessive snapshot testing
});
