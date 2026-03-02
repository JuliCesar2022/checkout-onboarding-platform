import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import '@testing-library/jest-dom';
import React from 'react';

describe('Input', () => {
  test('renders label and input correctly', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  test('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input label="Username" onChange={handleChange} />);
    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'testuser' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).value).toBe('testuser');
  });

  test('displays error message and applies error styles', () => {
    render(<Input label="Username" error="Invalid username" />);
    expect(screen.getByText('Invalid username')).toBeInTheDocument();
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-red-300');
  });

  test('renders endIcon when provided', () => {
    const Icon = () => <span data-testid="test-icon">🔍</span>;
    render(<Input label="Search" endIcon={<Icon />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('uses provided id instead of generated useId', () => {
    render(<Input label="Username" id="custom-id" />);
    const input = screen.getByLabelText('Username');
    expect(input.id).toBe('custom-id');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Input label="Username" disabled />);
    const input = screen.getByLabelText('Username');
    expect(input).toBeDisabled();
  });
});
