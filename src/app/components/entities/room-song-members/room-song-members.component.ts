import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ClientsFacade } from 'src/app/store/clients/clients.facade';
import { RoomsFacade } from 'src/app/store/rooms/rooms.facade';
import { RoomDetail, RoomMember } from 'src/utils';

@Component({
  selector: 'app-room-song-members',
  templateUrl: './room-song-members.component.html',
  styleUrls: ['./room-song-members.component.scss'],
})
export class RoomSongMembersComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public selectedRoomDetail: RoomDetail | undefined;
  public users: RoomMember[] = [];

  constructor(private roomsFacade: RoomsFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe(): void {
    this._subscription$.add(
      this.roomsFacade.selectedRoomDetail$.subscribe(
        (data: RoomDetail | undefined) => {
          if (!data) this.users = [];
          this.users = data.clients.map(
            (client) =>
              client.user && {
                ...client.user,
                isHost: client.clientId === data.clientHostId,
              }
          );
        }
      )
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
