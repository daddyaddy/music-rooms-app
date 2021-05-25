import { RoomsFacade } from 'src/app/store/rooms/rooms.facade';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { ClientsFacade } from 'src/app/store/clients/clients.facade';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-room-song-host-pilot',
  templateUrl: './room-song-host-pilot.component.html',
  styleUrls: ['./room-song-host-pilot.component.scss'],
})
export class RoomSongHostPilotComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();

  public currentClientId: string;
  public selectedRoomDetail: RoomDetail | undefined = undefined;
  public isExistHost: boolean = false;
  public isCurrentUserIsHost: boolean = false;

  constructor(
    private roomsFacade: RoomsFacade,
    private clientsFacade: ClientsFacade
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  private subscribe(): void {
    this._subscription$.add(
      this.clientsFacade.currentClientId$.subscribe((data) => {
        this.currentClientId = data;
      })
    );
    this._subscription$.add(
      this.roomsFacade.isSelectedRoomHostClientIsYou$.subscribe((data) => {
        this.isCurrentUserIsHost = data;
      })
    );
    this._subscription$.add(
      this.roomsFacade.isSelectedRoomHostUserInsideRoom$.subscribe((data) => {
        this.isExistHost = data;
      })
    );
    this._subscription$.add(
      this.roomsFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
  }

  public handleHostButtonClick = (): void => {
    const { roomId } = this.selectedRoomDetail;
    if (!this.selectedRoomDetail) return;

    this.roomsFacade.becomeHost(roomId);
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
