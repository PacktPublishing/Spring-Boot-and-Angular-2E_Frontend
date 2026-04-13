import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookNotification } from '../../../shared/models/notification';
import { NotificationService } from './notification.service';

interface MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: (() => void) | null;
  close: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  listeners: Record<string, ((event: Event) => void)[]>;
}

function createMockEventSource(): MockEventSource {
  const mock: MockEventSource = {
    onmessage: null,
    onerror: null,
    close: vi.fn(),
    listeners: {},
    addEventListener: vi.fn((eventName: string, handler: (event: Event) => void) => {
      if (!mock.listeners[eventName]) {
        mock.listeners[eventName] = [];
      }
      mock.listeners[eventName].push(handler);
    }),
  };
  return mock;
}

const newBookNotification: BookNotification = {
  eventType: 'NEW_BOOK',
  bookId: 42,
  bookTitle: 'Angular in Action',
  isbn: '978-0000000001',
};

describe('NotificationService', () => {
  let service: NotificationService;
  let mockEventSourceInstance: MockEventSource;
  let EventSourceConstructor: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEventSourceInstance = createMockEventSource();
    // Must use a regular function (not arrow) so it can be called with `new`
    EventSourceConstructor = vi.fn(function () {
      return mockEventSourceInstance;
    } as unknown as new (url: string) => MockEventSource);
    vi.stubGlobal('EventSource', EventSourceConstructor);

    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.restoreAllMocks();    // restores vi.spyOn spies
    vi.unstubAllGlobals();   // restores globals set via vi.stubGlobal (e.g. EventSource)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open an EventSource connection when connect() is called', () => {
    service.connect().subscribe().unsubscribe();
    expect(EventSourceConstructor).toHaveBeenCalledOnce();
  });

  it('should emit a NEW_BOOK notification received via onmessage', () => {
    const received: BookNotification[] = [];

    const subscription = service.connect().subscribe((n) => received.push(n));

    mockEventSourceInstance.onmessage!(
      new MessageEvent('message', { data: JSON.stringify(newBookNotification) }),
    );

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(newBookNotification);

    subscription.unsubscribe();
  });

  it('should emit a NEW_BOOK notification received via the named addEventListener handler', () => {
    const received: BookNotification[] = [];

    const subscription = service.connect().subscribe((n) => received.push(n));

    const newBookListeners = mockEventSourceInstance.listeners['NEW_BOOK'];
    expect(newBookListeners).toBeDefined();
    expect(newBookListeners.length).toBeGreaterThan(0);

    newBookListeners[0](
      new MessageEvent('NEW_BOOK', { data: JSON.stringify(newBookNotification) }),
    );

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(newBookNotification);

    subscription.unsubscribe();
  });

  it('should ignore events whose eventType is not NEW_BOOK', () => {
    const received: BookNotification[] = [];

    const subscription = service.connect().subscribe((n) => received.push(n));

    mockEventSourceInstance.onmessage!(
      new MessageEvent('message', {
        data: JSON.stringify({ eventType: 'PRICE_CHANGE', bookId: 7, bookTitle: 'Some Book' }),
      }),
    );

    expect(received).toHaveLength(0);

    subscription.unsubscribe();
  });

  it('should call eventSource.close() when the subscriber unsubscribes', () => {
    const subscription = service.connect().subscribe();

    expect(mockEventSourceInstance.close).not.toHaveBeenCalled();

    subscription.unsubscribe();

    expect(mockEventSourceInstance.close).toHaveBeenCalledOnce();
  });

  it('should complete immediately without opening a connection on the server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    const serverService = TestBed.inject(NotificationService);

    let completed = false;
    const received: BookNotification[] = [];

    serverService.connect().subscribe({
      next: (n) => received.push(n),
      complete: () => (completed = true),
    });

    expect(completed).toBe(true);
    expect(received).toHaveLength(0);
    expect(EventSourceConstructor).not.toHaveBeenCalled();
  });
});
