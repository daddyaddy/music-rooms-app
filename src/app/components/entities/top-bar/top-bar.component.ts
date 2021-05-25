import { Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientsFacade } from 'src/app/store/clients/clients.facade';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  currentUser: User | undefined;

  constructor(private clientsFacade: ClientsFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe() {
    this.clientsFacade.currentUser$.subscribe((data) => {
      this.currentUser = data;
    });
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
