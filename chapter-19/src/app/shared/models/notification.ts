export interface BookNotification {
  eventType: 'NEW_BOOK';
  bookId: number;
  bookTitle: string;
  isbn?: string;
}
