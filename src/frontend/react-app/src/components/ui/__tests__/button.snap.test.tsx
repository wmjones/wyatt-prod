import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from '../button';

/**
 * Minimal button component snapshot tests
 *
 * These snapshots are kept minimal and focused on key visual states:
 * 1. Default button
 * 2. Primary variant (the most commonly used visual state)
 * 3. Disabled state (important user-visible state)
 *
 * We avoid creating excessive snapshots for every possible prop combination,
 * focusing only on states that are valuable to track for visual regression.
 */
describe('Button Component Snapshots', () => {
  it('renders default button correctly', () => {
    const tree = renderer
      .create(<Button>Default Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders primary variant button correctly', () => {
    const tree = renderer
      .create(<Button variant="primary">Primary Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot('primary button');
  });

  it('renders disabled button correctly', () => {
    const tree = renderer
      .create(<Button disabled>Disabled Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
