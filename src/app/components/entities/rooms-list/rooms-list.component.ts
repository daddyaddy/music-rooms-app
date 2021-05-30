import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreFacade } from 'src/app/core/store/store.facade';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
})
export class RoomsListComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public roomsDetails: RoomDetail[] = [];

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  private subscribe(): void {
    this._subscription$.add(
      this.storeFacade.roomsDetails$.subscribe((data) => {
        this.roomsDetails = data ? data : [];
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
