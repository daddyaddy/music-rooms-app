import { environment } from './../../../environments/environment';
import { getRequestMessageType } from './communication';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { take, map, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import StableWebSocketSubject from './websocket.helpers';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private pingInterval;
  private readonly url: string = environment.wsUrl;
  private readonly _pendingMessages: BehaviorSubject<ClientMessageDataType[]>;
  private readonly _webSocket: StableWebSocketSubject<
    MessageData<unknown, unknown>
  >;
  public readonly pendingMessages$: Observable<ClientMessageDataType[]>;
  public readonly webSocket$: Observable<MessageData<any, unknown>>;

  constructor() {
    const { url, deserializer } = this;
    this._pendingMessages = new BehaviorSubject([]);
    this._webSocket = new StableWebSocketSubject({ url, deserializer });
    this.webSocket$ = this._webSocket.asObservable();
    this.pendingMessages$ = this._pendingMessages.asObservable();
    this.subscribe();
    this.pingInterval = setInterval(() => this.ping(), 25000);
  }

  private ping() {
    this.send({ type: ClientMessageDataType.PING, payload: {} });
  }

  private subscribe() {
    this.webSocket$
      .pipe(withLatestFrom(this.pendingMessages$))
      .subscribe(([responseMessage, pendingMessages]) => {
        const requestMessageType = getRequestMessageType(responseMessage.type);
        this._pendingMessages.next(
          pendingMessages.filter(
            (pendingMessage) => requestMessageType !== pendingMessage
          )
        );
      });
  }

  private deserializer = (msg: any) => JSON.parse(msg.data);

  public send<P extends {} = {}>(
    messageData: MessageData<ClientMessageDataType, P>
  ): void {
    const { type } = messageData;
    this._pendingMessages.pipe(take(1)).subscribe((pendingMessages) => {
      this._pendingMessages.next([...pendingMessages, type]);
    });

    this._webSocket.next(messageData);
  }

  public isPending$(messageType: ClientMessageDataType): Observable<boolean> {
    return this.pendingMessages$.pipe(
      map((pendingMessages) =>
        Boolean(
          pendingMessages.find(
            (pendingMessage) => pendingMessage === messageType
          )
        )
      )
    );
  }
}
