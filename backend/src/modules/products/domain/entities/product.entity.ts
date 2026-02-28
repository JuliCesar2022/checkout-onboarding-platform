export class ProductEntity {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string | null;
  priceInCents: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }

  get isAvailable(): boolean {
    return this.stock > 0;
  }

  get priceInCOP(): number {
    return this.priceInCents / 100;
  }
}
