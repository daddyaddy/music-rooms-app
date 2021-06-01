import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RoomDetail, RoomMember } from 'src/utils';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-room-members',
  templateUrl: './room-members.component.html',
  styleUrls: ['./room-members.component.scss'],
})
export class RoomMembersComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public selectedRoomDetail: RoomDetail | undefined;
  public users: RoomMember[] = [];

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe(): void {
    this._subscription$.add(
      this.storeFacade.selectedRoomDetail$.subscribe(
        (data: RoomDetail | undefined) => {
          if (!data) return (this.users = []);
          this.users = data.clients.map((client) => ({
            ...client,
            isHost: client.clientId === data.clientHostId,
          }));
        }
      )
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
