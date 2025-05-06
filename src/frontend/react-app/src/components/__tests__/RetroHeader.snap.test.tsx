import React from 'react';
import renderer from 'react-test-renderer';
import RetroHeader from '../RetroHeader';

describe('RetroHeader Snapshots', () => {
  it('renders correctly with title only', () => {
    const tree = renderer
      .create(<RetroHeader title="Test Title" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title and subtitle', () => {
    const tree = renderer
      .create(<RetroHeader title="Test Title" subtitle="Test Subtitle" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
