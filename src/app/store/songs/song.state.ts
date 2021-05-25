import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ofType } from '../operators';
import { WebsocketService } from '../webosocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ClientsState {
  private _songs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  public songs$: Observable<Song[]>;

  constructor(private webSocketService: WebsocketService) {
    this.songs$ = this._songs$.asObservable();
    this.subscribe();
  }

  private subscribe(): void {
    const { webSocket$ } = this.webSocketService;

    webSocket$
      .pipe(ofType(MessageDataType.APP_NEXT_CURRENT_CLIENT_ID))
      .subscribe(
        (messageData: MessageData<AppNextCurrentClientIdPayload>) => {}
      );

    webSocket$
      .pipe(ofType(MessageDataType.APP_NEXT_CLIENTS))
      .subscribe((messageData: MessageData<AppNextClientsPayload>) => {});
  }

  public authClient(payload: WsAuthUserPayload): void {
    this.webSocketService.send<WsAuthUserPayload>({
      type: MessageDataType.WS_AUTH_CLIENT,
      payload,
    });
  }

  public joinRoom(payload: WsJoinRoomPayload) {
    this.webSocketService.send<WsJoinRoomPayload>({
      type: MessageDataType.WS_JOIN_ROOM,
      payload,
    });
  }

  public leftRoom(payload: WsLeftRoomPayload) {
    this.webSocketService.send<WsLeftRoomPayload>({
      type: MessageDataType.WS_LEFT_ROOM,
      payload,
    });
  }
}
