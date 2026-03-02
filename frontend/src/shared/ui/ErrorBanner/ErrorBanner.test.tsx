import { render, screen } from '@testing-library/react';
import { ErrorBanner } from './ErrorBanner';
import '@testing-library/jest-dom';

describe('ErrorBanner', () => {
  test('renders error message when provided', () => {
    const message = 'Something went wrong';
    render(<ErrorBanner message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('does not render when message is null', () => {
    const { container } = render(<ErrorBanner message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('does not render when message is empty string', () => {
    const { container } = render(<ErrorBanner message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('applies accessible role correctly', () => {
    render(<ErrorBanner message="Test error" />);
    const banner = screen.getByRole('alert');
    expect(banner).toHaveClass('bg-red-50');
  });
});
