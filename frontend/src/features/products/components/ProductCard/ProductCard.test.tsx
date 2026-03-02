import { screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { renderWithProviders } from '../../../../test-utils';
import '@testing-library/jest-dom';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  priceInCents: 10000,
  stock: 10,
  imageUrl: 'test-image.jpg',
  categoryId: 'cat1',
  isAvailable: true,
};

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    // 10000 cents = $ 100
    renderWithProviders(<ProductCard product={mockProduct} onPay={jest.fn()} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    // Use a function or regex to match price, as Intl.NumberFormat may vary
    expect(screen.getByText(/\$?\s?100/)).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('calls onPay when "Comprar ahora" is clicked', () => {
    const handlePay = jest.fn();
    renderWithProviders(<ProductCard product={mockProduct} onPay={handlePay} />);
    
    const buyButton = screen.getByText('Comprar ahora');
    fireEvent.click(buyButton);
    
    expect(handlePay).toHaveBeenCalledWith(mockProduct);
  });

  test('dispatches addToCart when cart button is clicked', () => {
    const { store } = renderWithProviders(<ProductCard product={mockProduct} onPay={jest.fn()} />);
    
    const cartButton = screen.getByLabelText('Agregar al carrito');
    fireEvent.click(cartButton);
    
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].productId).toBe(mockProduct.id);
  });

  test('shows out of stock state', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} onPay={jest.fn()} />);
    
    const buyButton = screen.getByText('Comprar ahora');
    expect(buyButton).toBeDisabled();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});
