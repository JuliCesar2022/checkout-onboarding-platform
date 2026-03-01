export class CategoryEntity {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
