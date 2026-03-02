export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  children: Category[];
}
