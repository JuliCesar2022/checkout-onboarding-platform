import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import '@testing-library/jest-dom';

describe('Input', () => {
  test('renders label and input correctly', () => {
    render(<Input label="Usuario" placeholder="Ingrese usuario" />);
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese usuario')).toBeInTheDocument();
  });

  test('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input label="Usuario" onChange={handleChange} />);
    const input = screen.getByLabelText('Usuario');
    fireEvent.change(input, { target: { value: 'testuser' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).value).toBe('testuser');
  });

  test('displays error message and applies error styles', () => {
    render(<Input label="Usuario" error="Usuario inválido" />);
    expect(screen.getByText('Usuario inválido')).toBeInTheDocument();
    const input = screen.getByLabelText('Usuario');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-red-300');
  });

  test('renders endIcon when provided', () => {
    const Icon = () => <span data-testid="test-icon">🔍</span>;
    render(<Input label="Buscar" endIcon={<Icon />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('uses provided id instead of generated useId', () => {
    render(<Input label="Usuario" id="custom-id" />);
    const input = screen.getByLabelText('Usuario');
    expect(input.id).toBe('custom-id');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Input label="Usuario" disabled />);
    const input = screen.getByLabelText('Usuario');
    expect(input).toBeDisabled();
  });
});
