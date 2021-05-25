import { RoomsFacade } from './store/rooms/rooms.facade';
import { Subscription } from 'rxjs';
import { OnDestroy, OnInit } from '@angular/core';

import { Component } from '@angular/core';
import { ClientsFacade } from './store/clients/clients.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  public isCurrentClientAuth: boolean = false;
  public selectedRoom: Room | undefined = undefined;

  constructor(
    private clientsFacade: ClientsFacade,
    private roomsFacade: RoomsFacade
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe() {
    this._subscription$.add(
      this.clientsFacade.isCurrentClientAuth$.subscribe((data) => {
        this.isCurrentClientAuth = data;
      })
    );
    this._subscription$.add(
      this.roomsFacade.selectedRoom$.subscribe((data) => {
        this.selectedRoom = data;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
