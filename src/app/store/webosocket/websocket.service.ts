import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private static readonly url: string = `ws://localhost:8999`;
  private _webSocket$: Subject<MessageData<any, any>>;
  public webSocket$: Observable<MessageData<any, any>>;

  constructor() {
    this.connect(WebsocketService.url);
  }

  private connect(url): void {
    if (this._webSocket$) return;

    this._webSocket$ = webSocket({
      url,
      deserializer: (msg) => JSON.parse(msg.data),
    });
    this.webSocket$ = this._webSocket$.asObservable();
    this._webSocket$.subscribe((data) => {
      console.log('[NEW MESSAGE]', data);
    });
  }

  public send<T = ClientMessageDataType, P = any>(
    messageData: MessageData<T, P>
  ): void {
    this._webSocket$.next(messageData);
  }
}
