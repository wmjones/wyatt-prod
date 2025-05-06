import React from 'react';
import { render, screen } from '../../test-utils/testing-library-utils';
import Layout from '../Layout';

// Mock the child components
jest.mock('../RetroHeader', () => {
  return function MockRetroHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
      <div data-testid="mock-retro-header">
        <div data-testid="header-title">{title}</div>
        <div data-testid="header-subtitle">{subtitle}</div>
      </div>
    );
  };
});

jest.mock('../RetroFooter', () => {
  return function MockRetroFooter() {
    return <div data-testid="mock-retro-footer" />;
  };
});

jest.mock('../RetroPattern', () => {
  return function MockRetroPattern() {
    return <div data-testid="mock-retro-pattern" />;
  };
});

jest.mock('../CursorTrail', () => {
  return function MockCursorTrail() {
    return <div data-testid="mock-cursor-trail" />;
  };
});

jest.mock('../LoginBox', () => {
  return function MockLoginBox() {
    return <div data-testid="mock-login-box" />;
  };
});

describe('Layout Component', () => {
  it('renders all child components', () => {
    render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    );

    // Check for all the mocked components
    expect(screen.getByTestId('mock-retro-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-retro-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-retro-pattern')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cursor-trail')).toBeInTheDocument();
    expect(screen.getByTestId('mock-login-box')).toBeInTheDocument();
  });

  it('renders the provided children', () => {
    render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    );

    // Check that the content is rendered
    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test Content');
  });

  it('passes correct props to the RetroHeader', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Check that the RetroHeader receives the correct props
    expect(screen.getByTestId('header-title')).toHaveTextContent('D3 VISUALIZATION DASHBOARD');
    expect(screen.getByTestId('header-subtitle')).toHaveTextContent('Interactive Data Visualization');
  });

  it('uses container styling for layout', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Check for container class
    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toBeInTheDocument();

    // Check for padding and margin classes
    expect(mainContainer).toHaveClass('px-4');
    expect(mainContainer).toHaveClass('py-12');
    expect(mainContainer).toHaveClass('mx-auto');
  });

  it('has a min-height-screen wrapper', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Check for the min-height-screen class
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('renders content inside a main tag', () => {
    const { container } = render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    );

    // Check that the content is inside a main tag
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toContainElement(screen.getByTestId('content'));
  });
});
