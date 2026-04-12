export interface BookNotification {
  type: 'NEW_BOOK';
  bookId: number;
  title: string;
  price: number;
  timestamp?: string;
}