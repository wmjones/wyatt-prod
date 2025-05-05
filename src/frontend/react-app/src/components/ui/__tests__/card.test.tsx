import React from 'react';
import { render, screen } from '../../../test-utils/testing-library-utils';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '../card';

describe('Card Components', () => {
  // Test Card component
  describe('Card Component', () => {
    it('renders correctly with default props', () => {
      render(<Card data-testid="card">Card Content</Card>);

      const cardElement = screen.getByTestId('card');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveTextContent('Card Content');
      expect(cardElement).toHaveClass('rounded-lg', 'border', 'bg-card');
    });

    it('applies retro style when retro prop is true', () => {
      render(<Card retro data-testid="retro-card">Retro Card</Card>);

      const cardElement = screen.getByTestId('retro-card');
      expect(cardElement).toHaveClass('retro-card', 'border-4', 'border-black');
    });

    it('applies custom className correctly', () => {
      render(<Card className="custom-class" data-testid="custom-card">Custom Card</Card>);

      const cardElement = screen.getByTestId('custom-card');
      expect(cardElement).toHaveClass('custom-class');
    });
  });

  // Test CardHeader component
  describe('CardHeader Component', () => {
    it('renders correctly with default props', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);

      const headerElement = screen.getByTestId('card-header');
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveTextContent('Header Content');
      expect(headerElement).toHaveClass('flex', 'flex-col', 'p-6');
    });

    it('applies custom className correctly', () => {
      render(<CardHeader className="custom-header" data-testid="custom-header">Custom Header</CardHeader>);

      const headerElement = screen.getByTestId('custom-header');
      expect(headerElement).toHaveClass('custom-header');
    });
  });

  // Test CardTitle component
  describe('CardTitle Component', () => {
    it('renders correctly with default props', () => {
      render(<CardTitle data-testid="card-title">Title Text</CardTitle>);

      const titleElement = screen.getByTestId('card-title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Title Text');
      expect(titleElement.tagName).toBe('H3');
      expect(titleElement).toHaveClass('text-2xl', 'font-semibold');
    });

    it('applies custom className correctly', () => {
      render(<CardTitle className="custom-title" data-testid="custom-title">Custom Title</CardTitle>);

      const titleElement = screen.getByTestId('custom-title');
      expect(titleElement).toHaveClass('custom-title');
    });
  });

  // Test CardDescription component
  describe('CardDescription Component', () => {
    it('renders correctly with default props', () => {
      render(<CardDescription data-testid="card-description">Description Text</CardDescription>);

      const descriptionElement = screen.getByTestId('card-description');
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveTextContent('Description Text');
      expect(descriptionElement.tagName).toBe('P');
      expect(descriptionElement).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('applies custom className correctly', () => {
      render(<CardDescription className="custom-desc" data-testid="custom-desc">Custom Description</CardDescription>);

      const descriptionElement = screen.getByTestId('custom-desc');
      expect(descriptionElement).toHaveClass('custom-desc');
    });
  });

  // Test CardContent component
  describe('CardContent Component', () => {
    it('renders correctly with default props', () => {
      render(<CardContent data-testid="card-content">Content Text</CardContent>);

      const contentElement = screen.getByTestId('card-content');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent('Content Text');
      expect(contentElement).toHaveClass('p-6', 'pt-0');
    });

    it('applies custom className correctly', () => {
      render(<CardContent className="custom-content" data-testid="custom-content">Custom Content</CardContent>);

      const contentElement = screen.getByTestId('custom-content');
      expect(contentElement).toHaveClass('custom-content');
    });
  });

  // Test CardFooter component
  describe('CardFooter Component', () => {
    it('renders correctly with default props', () => {
      render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);

      const footerElement = screen.getByTestId('card-footer');
      expect(footerElement).toBeInTheDocument();
      expect(footerElement).toHaveTextContent('Footer Content');
      expect(footerElement).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('applies custom className correctly', () => {
      render(<CardFooter className="custom-footer" data-testid="custom-footer">Custom Footer</CardFooter>);

      const footerElement = screen.getByTestId('custom-footer');
      expect(footerElement).toHaveClass('custom-footer');
    });
  });

  // Test the complete Card with all components
  describe('Complete Card with all subcomponents', () => {
    it('renders a complete card structure correctly', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader data-testid="complete-header">
            <CardTitle data-testid="complete-title">Card Title</CardTitle>
            <CardDescription data-testid="complete-description">Card Description</CardDescription>
          </CardHeader>
          <CardContent data-testid="complete-content">Card Content</CardContent>
          <CardFooter data-testid="complete-footer">Card Footer</CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByTestId('complete-header')).toBeInTheDocument();
      expect(screen.getByTestId('complete-title')).toBeInTheDocument();
      expect(screen.getByTestId('complete-description')).toBeInTheDocument();
      expect(screen.getByTestId('complete-content')).toBeInTheDocument();
      expect(screen.getByTestId('complete-footer')).toBeInTheDocument();

      expect(screen.getByTestId('complete-title')).toHaveTextContent('Card Title');
      expect(screen.getByTestId('complete-description')).toHaveTextContent('Card Description');
      expect(screen.getByTestId('complete-content')).toHaveTextContent('Card Content');
      expect(screen.getByTestId('complete-footer')).toHaveTextContent('Card Footer');
    });
  });
});
