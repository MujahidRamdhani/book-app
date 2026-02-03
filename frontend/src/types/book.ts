export type BookStatus = 'want-to-read' | 'reading' | 'completed';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  rating: number;
  pages?: number;
  genre?: string;
  status: BookStatus;
  created_at?: string;
}
