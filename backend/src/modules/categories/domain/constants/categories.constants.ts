export const CATEGORIES_ERRORS = {
  NOT_FOUND: (id: string) => `Category with id "${id}" not found`,
} as const;

export const CATEGORIES_CONFIG = {
  DEFAULT_SORT_FIELD: 'name',
  DEFAULT_SORT_ORDER: 'asc',
} as const;
