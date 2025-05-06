import React from 'react';
import renderer from 'react-test-renderer';
import RetroFooter from '../RetroFooter';

describe('RetroFooter Snapshots', () => {
  // Mock current year to ensure snapshot doesn't change every year
  const originalDate = global.Date;

  beforeEach(() => {
    // Mock Date to return fixed year
    global.Date = class extends Date {
      constructor(date) {
        if (date) {
          return super(date);
        }
        return new originalDate('2025-01-01T00:00:00.000Z');
      }
      getFullYear() {
        return 2025;
      }
    };
  });

  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });

  it('renders correctly', () => {
    const tree = renderer
      .create(<RetroFooter />)
      .toJSON();
    // Match against the existing snapshot
    expect(tree).toMatchSnapshot();
  });
});
