import type { Product } from '../../types';
import { Button } from '../../../../shared/ui/Button';
import { StockBadge } from '../StockBadge';

interface ProductCardProps {
  product: Product;
  onPay: (product: Product) => void;
}

export function ProductCard({ product, onPay }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  // TODO: implement card layout with Tailwind
  return (
    <article aria-label={product.name}>
      <img src={product.imageUrl} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <StockBadge stock={product.stock} />
      <p>{product.price}</p>
      <Button onClick={() => onPay(product)} disabled={isOutOfStock}>
        Pay with credit card
      </Button>
    </article>
  );
}
