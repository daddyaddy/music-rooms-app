import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ofType } from '../operators';
import { WebsocketService } from '../webosocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ClientsState {
  private _currentClientId$: BehaviorSubject<string> =
    new BehaviorSubject<string>(undefined);
  private _clients$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(
    []
  );
  public currentClientId$: Observable<string>;
  public clients$: Observable<Client[]>;

  constructor(private webSocketService: WebsocketService) {
    this.currentClientId$ = this._currentClientId$.asObservable();
    this.clients$ = this._clients$.asObservable();

    this.subscribe();
  }

  private subscribe(): void {
    const { webSocket$ } = this.webSocketService;

    webSocket$
      .pipe(ofType(ServerMessageDataType.NEXT_CURRENT_CLIENT_ID))
      .subscribe((messageData: MessageData) => {
        const { clientId } = messageData.payload;
        this._currentClientId$.next(clientId);
      });

    webSocket$
      .pipe(ofType(ServerMessageDataType.NEXT_CLIENTS))
      .subscribe((messageData: MessageData) => {
        const { clients } = messageData.payload;
        this._clients$.next(clients);
      });
  }

  public authClient(payload: AuthUserPayload): void {
    this.webSocketService.send<
      ClientMessageDataType.AUTH_CLIENT,
      AuthUserPayload
    >({
      type: ClientMessageDataType.AUTH_CLIENT,
      payload,
    });
  }

  public joinRoom(payload: JoinRoomPayload) {
    this.webSocketService.send<
      ClientMessageDataType.JOIN_ROOM,
      JoinRoomPayload
    >({
      type: ClientMessageDataType.JOIN_ROOM,
      payload,
    });
  }

  public leftRoom(payload: LeftRoomPayload) {
    this.webSocketService.send<
      ClientMessageDataType.LEFT_ROOM,
      LeftRoomPayload
    >({
      type: ClientMessageDataType.LEFT_ROOM,
      payload,
    });
  }
}
