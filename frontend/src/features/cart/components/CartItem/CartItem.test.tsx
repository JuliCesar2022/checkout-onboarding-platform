import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from './CartItem';
import '@testing-library/jest-dom';

const mockItem = {
  productId: '1',
  name: 'Test Product',
  priceInCents: 10000,
  quantity: 2,
  imageUrl: 'test-image.jpg',
};

describe('CartItem', () => {
  test('renders item information correctly', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    // 2 * 10000 cents = 200 pesos.
    expect(screen.getByText(/\$?\s?200/)).toBeInTheDocument();
    expect(screen.getByText(/\$?\s?100.*c\/u/)).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('calls onUpdateQuantity when quantity buttons are clicked', () => {
    const handleUpdate = jest.fn();
    render(<CartItem item={mockItem} onUpdateQuantity={handleUpdate} />);
    
    const incButton = screen.getByLabelText('Aumentar cantidad');
    fireEvent.click(incButton);
    expect(handleUpdate).toHaveBeenCalledWith(3);
    
    const decButton = screen.getByLabelText('Disminuir cantidad');
    fireEvent.click(decButton);
    expect(handleUpdate).toHaveBeenCalledWith(1);
  });

  test('calls onRemove when remove button is clicked', () => {
    const handleRemove = jest.fn();
    render(<CartItem item={mockItem} onUpdateQuantity={jest.fn()} onRemove={handleRemove} />);
    
    const removeButton = screen.getByLabelText('Eliminar del carrito');
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalled();
  });

  test('calls onToggleSelect when checkbox is clicked', () => {
    const handleToggle = jest.fn();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={jest.fn()}
        onToggleSelect={handleToggle}
        showCheckbox
        isSelected={false}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleToggle).toHaveBeenCalled();
  });

  test('applies compact styles when compact prop is true', () => {
    render(<CartItem item={mockItem} onUpdateQuantity={jest.fn()} compact />);
    // Check for unit price being hidden in compact mode
    expect(screen.queryByText(/c\/u/)).not.toBeInTheDocument();
  });
});
