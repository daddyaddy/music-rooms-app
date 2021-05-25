import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ofType } from '../operators';
import { WebsocketService } from '../webosocket/websocket.service';

@Injectable({ providedIn: 'root' })
export class RoomsState {
  private _rooms$: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
  public rooms$: Observable<Room[]>;

  constructor(private webSocketService: WebsocketService) {
    this.rooms$ = this._rooms$.asObservable();
    this.subscribe();
  }

  private subscribe(): void {
    const { webSocket$ } = this.webSocketService;

    webSocket$
      .pipe(ofType(ServerMessageDataType.NEXT_ROOMS))
      .subscribe(
        (messageData: MessageData<ServerMessageDataType, NextRoomsPayload>) => {
          const { rooms } = messageData.payload;
          this._rooms$.next(rooms);
        }
      );
  }

  public createRoom(payload: CreateRoomPayload) {
    this.webSocketService.send({
      type: ClientMessageDataType.CREATE_ROOM,
      payload,
    });
  }

  public becomeHost(payload: BecomeHostPayload): void {
    this.webSocketService.send({
      type: ClientMessageDataType.BECOME_HOST,
      payload,
    });
  }

  public addRoomSong(payload: AddRoomSongPayload): void {
    this.webSocketService.send({
      type: ClientMessageDataType.ADD_ROOM_SONG,
      payload,
    });
  }

  public playRoomSong(payload: PlayRoomSongPayload): void {
    this.webSocketService.send({
      type: ClientMessageDataType.PLAY_ROOM_SONG,
      payload,
    });
  }

  public pauseRoomSong(payload: PauseRoomSongPayload): void {
    this.webSocketService.send({
      type: ClientMessageDataType.PAUSE_ROOM_SONG,
      payload,
    });
  }

  public prevRoomSong(payload: PrevRoomSongPayload): void {
    this.webSocketService.send({
      type: ClientMessageDataType.PREV_ROOM_SONG,
      payload,
    });
  }

  public nextRoomSong(payload: NextRoomSongPayload): void {
    this.webSocketService.send({
      type: ClientMessageDataType.NEXT_ROOM_SONG,
      payload,
    });
  }
}
