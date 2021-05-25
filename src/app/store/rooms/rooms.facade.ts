import { Observable } from 'rxjs';
import { ClientsState } from './../clients/clients.state';
import { Injectable } from '@angular/core';
import { RoomsState } from './rooms.state';
import {
  getIsSelectedRoomHostClientIsYou$,
  getIsSelectedRoomHostUserInsideRoom$,
  getRooms$,
  getRoomsDetails$,
  getSelectedRoom$,
  getSelectedRoomDetail$,
  getSelectedRoomHostClient$,
  getSelectedRoomHostUser$,
  getSelectedRoomCurrentSong$,
} from './rooms.selectors';
import { RoomDetail } from 'src/utils';

@Injectable({
  providedIn: 'root',
})
export class RoomsFacade {
  public rooms$: Observable<Room[]>;
  public roomsDetails$: Observable<RoomDetail[]>;
  public selectedRoom$: Observable<Room | undefined>;
  public selectedRoomCurrentSong$: Observable<Song | undefined>;
  public selectedRoomDetail$: Observable<RoomDetail | undefined>;
  public selectedRoomHostClient$: Observable<Client | undefined>;
  public selectedRoomHostUser$: Observable<User | undefined>;
  public isSelectedRoomHostClientIsYou$: Observable<boolean>;
  public isSelectedRoomHostUserInsideRoom$: Observable<boolean>;

  constructor(
    private roomsState: RoomsState,
    private clientsState: ClientsState
  ) {
    this.rooms$ = getRooms$(roomsState);
    this.roomsDetails$ = getRoomsDetails$(roomsState, clientsState);
    this.selectedRoom$ = getSelectedRoom$(roomsState, clientsState);
    this.selectedRoomCurrentSong$ = getSelectedRoomCurrentSong$(
      roomsState,
      clientsState
    );
    this.selectedRoomDetail$ = getSelectedRoomDetail$(roomsState, clientsState);
    this.selectedRoomHostClient$ = getSelectedRoomHostClient$(
      roomsState,
      clientsState
    );
    this.selectedRoomHostUser$ = getSelectedRoomHostUser$(
      roomsState,
      clientsState
    );
    this.isSelectedRoomHostClientIsYou$ = getIsSelectedRoomHostClientIsYou$(
      roomsState,
      clientsState
    );
    this.isSelectedRoomHostUserInsideRoom$ =
      getIsSelectedRoomHostUserInsideRoom$(roomsState, clientsState);
  }

  public createRoom(roomName: string): void {
    this.roomsState.createRoom({ roomName });
  }

  public becomeHost(roomId: string): void {
    this.roomsState.becomeHost({ roomId });
  }

  public addRoomSong(roomSong: RoomSong, roomId: string): void {
    this.roomsState.addRoomSong({ roomSong, roomId });
  }

  public playRoomSong(roomId: string): void {
    this.roomsState.playRoomSong({ roomId });
  }

  public pauseRoomSong(roomId: string): void {
    this.roomsState.pauseRoomSong({ roomId });
  }

  public prevRoomSong(roomId: string): void {
    this.roomsState.prevRoomSong({ roomId });
  }

  public nextRoomSong(roomId: string): void {
    this.roomsState.nextRoomSong({ roomId });
  }
}
