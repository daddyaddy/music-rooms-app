import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  getClients$,
  getCurrentClient$,
  getCurrentClientId$,
  getIsCurrentClientAuth$,
  getIsCurrentClientIsHost$,
  getIsSelectedRoomHostUserInsideRoom$,
  getRooms$,
  getRoomsDetails$,
  getSelectedRoom$,
  getSelectedRoomDetail$,
  getSelectedRoomHostClient$,
  getSelectedRoomCurrentSong$,
} from './store.selectors';
import { StoreService } from './store.service';
import { WebSocketService } from '../websocket/websocket.service';
import { RoomDetail } from 'src/utils';

@Injectable({ providedIn: 'root' })
export class StoreFacade {
  public readonly currentClientId$: Observable<string>;
  public readonly clients$: Observable<Client[]>;
  public readonly currentClient$: Observable<Client | undefined>;
  public readonly isCurrentClientAuth$: Observable<boolean>;
  public readonly isExistHost$: Observable<boolean>;
  public readonly isCurrentUserIsHost$: Observable<boolean>;
  public readonly rooms$: Observable<Room[]>;
  public readonly roomsDetails$: Observable<RoomDetail[]>;
  public readonly selectedRoom$: Observable<Room | undefined>;
  public readonly selectedRoomCurrentSong$: Observable<Song | undefined>;
  public readonly selectedRoomDetail$: Observable<RoomDetail | undefined>;
  public readonly selectedRoomHostClient$: Observable<Client | undefined>;
  public readonly isCurrentClientIsHost$: Observable<boolean>;
  public readonly isSelectedRoomHostUserInsideRoom$: Observable<boolean>;

  constructor(
    private webSocketService: WebSocketService,
    private storeService: StoreService
  ) {
    this.currentClientId$ = getCurrentClientId$(storeService);
    this.clients$ = getClients$(storeService);
    this.currentClient$ = getCurrentClient$(storeService);
    this.isCurrentClientAuth$ = getIsCurrentClientAuth$(storeService);
    this.rooms$ = getRooms$(storeService);
    this.roomsDetails$ = getRoomsDetails$(storeService);
    this.selectedRoom$ = getSelectedRoom$(storeService);
    this.selectedRoomCurrentSong$ = getSelectedRoomCurrentSong$(storeService);
    this.selectedRoomDetail$ = getSelectedRoomDetail$(storeService);
    this.selectedRoomHostClient$ = getSelectedRoomHostClient$(storeService);
    this.isCurrentClientIsHost$ = getIsCurrentClientIsHost$(storeService);
    this.isSelectedRoomHostUserInsideRoom$ =
      getIsSelectedRoomHostUserInsideRoom$(storeService);
  }

  public authClient(nickname: string) {
    this.webSocketService.send<AuthUserPayload>({
      type: ClientMessageDataType.AUTH_CLIENT,
      payload: { nickname },
    });
  }

  public joinRoom(roomId: string): void {
    this.webSocketService.send<JoinRoomPayload>({
      type: ClientMessageDataType.JOIN_ROOM,
      payload: { roomId },
    });
  }

  public leftRoom(): void {
    this.webSocketService.send<LeftRoomPayload>({
      type: ClientMessageDataType.LEFT_ROOM,
      payload: {},
    });
  }

  public createRoom(payload: CreateRoomPayload) {
    this.webSocketService.send<CreateRoomPayload>({
      type: ClientMessageDataType.CREATE_ROOM,
      payload,
    });
  }

  public becomeHost(payload: BecomeHostPayload): void {
    this.webSocketService.send<BecomeHostPayload>({
      type: ClientMessageDataType.BECOME_HOST,
      payload,
    });
  }

  public addRoomSong(payload: AddRoomSongPayload): void {
    this.webSocketService.send<AddRoomSongPayload>({
      type: ClientMessageDataType.ADD_ROOM_SONG,
      payload,
    });
  }

  public playRoomSong(payload: PlayRoomSongPayload): void {
    this.webSocketService.send<PlayRoomSongPayload>({
      type: ClientMessageDataType.PLAY_ROOM_SONG,
      payload,
    });
  }

  public pauseRoomSong(payload: PauseRoomSongPayload): void {
    this.webSocketService.send<PauseRoomSongPayload>({
      type: ClientMessageDataType.PAUSE_ROOM_SONG,
      payload,
    });
  }

  public prevRoomSong(payload: PrevRoomSongPayload): void {
    this.webSocketService.send<PrevRoomSongPayload>({
      type: ClientMessageDataType.PREV_ROOM_SONG,
      payload,
    });
  }

  public nextRoomSong(payload: NextRoomSongPayload): void {
    this.webSocketService.send<NextRoomSongPayload>({
      type: ClientMessageDataType.NEXT_ROOM_SONG,
      payload,
    });
  }
}
