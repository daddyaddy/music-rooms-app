import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly url: string = `ws://localhost:8080`;
  private readonly _webSocket: Subject<MessageData<unknown, unknown>>;
  public readonly webSocket$: Observable<MessageData<unknown, unknown>>;

  constructor() {
    const { url, deserializer } = this;
    this._webSocket = webSocket({ url, deserializer });
    this.webSocket$ = this._webSocket.asObservable();
  }

  private deserializer = (msg: any) => JSON.parse(msg.data);

  public send<P extends {} = {}>(
    messageData: MessageData<ClientMessageDataType, P>
  ): void {
    this._webSocket.next(messageData);
  }
}
