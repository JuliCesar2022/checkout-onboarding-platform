export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
