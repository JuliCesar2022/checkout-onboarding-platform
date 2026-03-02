export class CategoryEntity {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  children: CategoryEntity[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
    this.children = this.children ?? [];
  }
}
