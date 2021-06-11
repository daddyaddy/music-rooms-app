import { Subject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, share, takeWhile } from 'rxjs/operators';
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket';

export const enum WebSocketStatusType {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

export default class StableWebSocketSubject<T> {
  private readonly _subscription$: Subscription;
  private readonly _messages: Subject<T>;
  private _webSocket: WebSocketSubject<T>;
  private readonly config: WebSocketSubjectConfig<T>;

  constructor(config: WebSocketSubjectConfig<T>) {
    this.config = config;
    this._messages = new Subject();
    this.connect();
  }

  private connect() {
    const { config } = this;
    this._webSocket = webSocket(config);
    this._webSocket.subscribe({
      next: (value) => this._messages.next(value),
      error: (error) => this.reconnect(error),
    });
  }

  private reconnect(error?: CloseEvent) {
    console.warn('[WS] Reconnecting...');
    this.connect();
  }

  public next(value: T) {
    this._webSocket.next(value);
  }

  public asObservable(): Observable<T> {
    return this._messages.asObservable();
  }
}
