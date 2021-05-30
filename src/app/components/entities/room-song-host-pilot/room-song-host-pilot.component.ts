import { StoreFacade } from './../../../core/store/store.facade';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  private subscribe(): void {
    this._subscription$.add(
      this.storeFacade.currentClientId$.subscribe((data) => {
        this.currentClientId = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.isCurrentClientIsHost$.subscribe((data) => {
        this.isCurrentUserIsHost = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.isSelectedRoomHostUserInsideRoom$.subscribe((data) => {
        this.isExistHost = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
  }

  public handleHostButtonClick = (): void => {
    const { roomId } = this.selectedRoomDetail;
    if (!this.selectedRoomDetail) return;

    this.storeFacade.becomeHost({ roomId });
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
