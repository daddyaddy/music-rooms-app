import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ofType } from 'src/utils';
import { WebSocketService } from '../websocket/websocket.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly _currentClientId: BehaviorSubject<string>;
  private readonly _clients: BehaviorSubject<Client[]>;
  private readonly _rooms: BehaviorSubject<Room[]>;
  public readonly currentClientId$: Observable<string>;
  public readonly clients$: Observable<Client[]>;
  public readonly rooms$: Observable<Room[]>;

  constructor(private webSocketService: WebSocketService) {
    this._currentClientId = new BehaviorSubject(undefined);
    this._clients = new BehaviorSubject([]);
    this._rooms = new BehaviorSubject([]);
    this.currentClientId$ = this._currentClientId.asObservable();
    this.clients$ = this._clients.asObservable();
    this.rooms$ = this._rooms.asObservable();
    this.subscribe();
  }

  private subscribe(): void {
    this.webSocketService.webSocket$
      .pipe(ofType(ServerMessageDataType.AUTH_CLIENT_SUCCESS))
      .subscribe((messageData: MessageData<ServerMessageDataType>) => {
        const { clientId, rooms } = messageData.payload;
        this._currentClientId.next(clientId);
        this._rooms.next(rooms);
      });

    this.webSocketService.webSocket$
      .pipe(ofType(ServerMessageDataType.NEXT_CLIENTS))
      .subscribe((messageData: MessageData<ServerMessageDataType>) => {
        const { clients } = messageData.payload;
        this._clients.next(clients);
      });

    this.webSocketService.webSocket$
      .pipe(ofType(ServerMessageDataType.NEXT_ROOMS))
      .subscribe(
        (messageData: MessageData<ServerMessageDataType, NextRoomsPayload>) => {
          const { rooms } = messageData.payload;
          this._rooms.next(rooms);
        }
      );
  }
}
