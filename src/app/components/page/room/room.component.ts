import { ClientsFacade } from 'src/app/store/clients/clients.facade';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomsFacade } from './../../../store/rooms/rooms.facade';
import { Component, OnInit } from '@angular/core';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public selectedRoomDetail: RoomDetail | undefined = undefined;

  constructor(
    private roomsFacade: RoomsFacade,
    private clientsFacade: ClientsFacade
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  private subscribe(): void {
    this._subscription$.add(
      this.roomsFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
  }

  handleRoomButtonClick = (): void => {
    this.clientsFacade.leftRoom();
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
