import React from 'react';
import renderer from 'react-test-renderer';
import { Input } from '../input';

describe('Input Component Snapshots', () => {
  it('renders default input correctly', () => {
    const tree = renderer
      .create(<Input placeholder="Default Input" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders retro input correctly', () => {
    const tree = renderer
      .create(<Input retro placeholder="Retro Input" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders different input types correctly', () => {
    const types = [
      'text',
      'password',
      'email',
      'number',
      'tel',
      'url',
      'search'
    ];

    types.forEach(type => {
      const tree = renderer
        .create(<Input type={type} placeholder={`${type} Input`} />)
        .toJSON();
      expect(tree).toMatchSnapshot(`${type} input`);
    });
  });

  it('renders disabled input correctly', () => {
    const tree = renderer
      .create(<Input disabled placeholder="Disabled Input" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders read-only input correctly', () => {
    const tree = renderer
      .create(<Input readOnly placeholder="ReadOnly Input" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders input with additional class name correctly', () => {
    const tree = renderer
      .create(<Input className="custom-class" placeholder="Custom Class Input" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
