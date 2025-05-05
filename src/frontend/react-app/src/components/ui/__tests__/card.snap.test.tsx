import React from 'react';
import renderer from 'react-test-renderer';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '../card';

describe('Card Components Snapshots', () => {
  it('renders Card component correctly', () => {
    const tree = renderer
      .create(<Card>Card Content</Card>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders retro Card correctly', () => {
    const tree = renderer
      .create(<Card retro>Retro Card</Card>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders CardHeader component correctly', () => {
    const tree = renderer
      .create(<CardHeader>Header Content</CardHeader>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders CardTitle component correctly', () => {
    const tree = renderer
      .create(<CardTitle>Title Content</CardTitle>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders CardDescription component correctly', () => {
    const tree = renderer
      .create(<CardDescription>Description Content</CardDescription>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders CardContent component correctly', () => {
    const tree = renderer
      .create(<CardContent>Content</CardContent>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders CardFooter component correctly', () => {
    const tree = renderer
      .create(<CardFooter>Footer Content</CardFooter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders complete Card component structure correctly', () => {
    const tree = renderer
      .create(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            Card Footer
          </CardFooter>
        </Card>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders Card with custom className correctly', () => {
    const tree = renderer
      .create(<Card className="custom-class">Custom Card</Card>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
