import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  private _subscription$: Subscription = new Subscription();
  currentClient: Client | undefined;

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe() {
    this.storeFacade.currentClient$.subscribe((data) => {
      this.currentClient = data;
    });
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
