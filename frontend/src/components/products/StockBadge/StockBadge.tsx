interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  // TODO: implement with Tailwind (green badge if available, red if out of stock)
  if (stock === 0) return <span>Out of stock</span>;
  return <span>{stock} available</span>;
}
