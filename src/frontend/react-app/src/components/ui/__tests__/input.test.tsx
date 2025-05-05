import React from 'react';
import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);

    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();

    // Check if the default class is applied
    expect(inputElement).toHaveClass('flex', 'h-10');
  });

  it('applies retro style when retro prop is true', () => {
    render(<Input retro placeholder="Retro Input" />);

    const inputElement = screen.getByPlaceholderText('Retro Input');
    expect(inputElement).toHaveClass('retro-input', 'border-2', 'border-black');
  });

  it('applies custom className correctly', () => {
    render(<Input className="custom-class" placeholder="Custom Class" />);

    const inputElement = screen.getByPlaceholderText('Custom Class');
    expect(inputElement).toHaveClass('custom-class');
  });

  it('handles value changes correctly', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input onChange={handleChange} placeholder="Type here" />);

    const inputElement = screen.getByPlaceholderText('Type here');
    await user.type(inputElement, 'test input');

    expect(handleChange).toHaveBeenCalledTimes(10); // 10 characters in 'test input'
    expect(inputElement).toHaveValue('test input');
  });

  it('handles different input types correctly', () => {
    const { rerender } = render(<Input type="text" placeholder="Text Input" />);

    let inputElement = screen.getByPlaceholderText('Text Input');
    expect(inputElement).toHaveAttribute('type', 'text');

    rerender(<Input type="password" placeholder="Password Input" />);
    inputElement = screen.getByPlaceholderText('Password Input');
    expect(inputElement).toHaveAttribute('type', 'password');

    rerender(<Input type="email" placeholder="Email Input" />);
    inputElement = screen.getByPlaceholderText('Email Input');
    expect(inputElement).toHaveAttribute('type', 'email');

    rerender(<Input type="number" placeholder="Number Input" />);
    inputElement = screen.getByPlaceholderText('Number Input');
    expect(inputElement).toHaveAttribute('type', 'number');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Input ref={ref} placeholder="Ref Input" />);

    const inputElement = screen.getByPlaceholderText('Ref Input');
    expect(ref.current).toBe(inputElement);
  });

  it('applies disabled state correctly', () => {
    render(<Input disabled placeholder="Disabled Input" />);

    const inputElement = screen.getByPlaceholderText('Disabled Input');
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveClass('disabled:opacity-50');
  });

  it('applies readOnly attribute correctly', () => {
    render(<Input readOnly placeholder="ReadOnly Input" />);

    const inputElement = screen.getByPlaceholderText('ReadOnly Input');
    expect(inputElement).toHaveAttribute('readonly');
  });

  it('combines retro style with custom classes', () => {
    render(<Input retro className="custom-class" placeholder="Combined Styles" />);

    const inputElement = screen.getByPlaceholderText('Combined Styles');
    expect(inputElement).toHaveClass('retro-input', 'custom-class');
  });
});
