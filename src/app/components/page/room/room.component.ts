import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RoomDetail } from 'src/utils';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public selectedRoomDetail: RoomDetail | undefined = undefined;

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  private subscribe(): void {
    this._subscription$.add(
      this.storeFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
  }

  handleRoomButtonClick = (): void => {
    this.storeFacade.leftRoom();
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
