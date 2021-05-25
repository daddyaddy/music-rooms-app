import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomsFacade } from 'src/app/store/rooms/rooms.facade';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
})
export class RoomsListComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public roomsDetails: RoomDetail[] = [];

  constructor(private roomsFacade: RoomsFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  private subscribe(): void {
    this._subscription$.add(
      this.roomsFacade.roomsDetails$.subscribe((data) => {
        this.roomsDetails = data;
        console.log(data);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
