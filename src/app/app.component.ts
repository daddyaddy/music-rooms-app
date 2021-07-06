import { LocalstorageService } from './core/localstorage/localstorage';
import { Subscription } from 'rxjs';
import { OnDestroy, OnInit } from '@angular/core';

import { Component } from '@angular/core';
import { StoreFacade } from './core/store/store.facade';
import {
  filter,
  take,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from 'rxjs/operators';
import { Router } from '@angular/router';

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
    private router: Router,
    private localstorageService: LocalstorageService,
    private storeFacade: StoreFacade
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe() {
    this._subscription$.add(
      this.localstorageService.localstorage$
        .pipe(
          take(1),
          filter((storage) => storage.nickname !== undefined)
        )
        .subscribe((data) =>
          this.storeFacade.authClient(data.nickname, data.avatarColor)
        )
    );

    this._subscription$.add(
      this.localstorageService.localstorage$
        .pipe(
          take(1),
          filter((storage) => storage.currentRoomId !== undefined)
        )
        .subscribe((data) => this.storeFacade.joinRoom(data.currentRoomId))
    );

    this._subscription$.add(
      this.storeFacade.isCurrentClientAuth$.subscribe((data) => {
        this.isCurrentClientAuth = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.selectedRoom$.subscribe((data) => {
        this.selectedRoom = data;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
