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
      const handleMessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.eventType !== 'NEW_BOOK') {
            return;
          }
          subscriber.next(parsed as BookNotification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };
      eventSource.onmessage = handleMessage;
      eventSource.addEventListener('NEW_BOOK', (event: Event) => {
        handleMessage(event as MessageEvent);
      });
      eventSource.onerror = () => {
        console.warn('SSE connection error. ' + 'Reconnecting...');
      };
      return () => {
        eventSource.close();
      };
    });
  }
}
