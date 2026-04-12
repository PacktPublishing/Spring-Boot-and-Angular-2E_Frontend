import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BookNotification } from '../../../shared/models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private platformId = inject(PLATFORM_ID);
  private streamUrl = `${environment.apiUrl}/inventory/api` + `/notifications/stream`;
  connect(): Observable<BookNotification> {
    return new Observable<BookNotification>((subscriber) => {
      if (!isPlatformBrowser(this.platformId)) {
        subscriber.complete();
        return;
      }
      const eventSource = new EventSource(this.streamUrl);
      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type !== 'NEW_BOOK') {
            return; // Ignore other event types
          }
          const notification: BookNotification = {
            ...parsed,
            timestamp: new Date().toISOString(),
          };
          subscriber.next(notification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };
      eventSource.onerror = () => {
        // EventSource reconnects automatically.
        // We log but don't complete the observable
        // — the stream will resume on its own.
        console.warn('SSE connection error. Reconnecting...');
      };
      // Cleanup: close the connection when
      // the observable is unsubscribed
      return () => {
        eventSource.close();
      };
    });
  }
}
