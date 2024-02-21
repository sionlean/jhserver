export interface CustomError {
  error: { message: string; code: string; details: string };
}

export type ServerResponse<T> = { code: number; reply: T };
