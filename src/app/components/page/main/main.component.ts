import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private _subscription$: Subscription = new Subscription();
  public isCurrentClientAuth: boolean = false;
  public selectedRoom: Room | undefined = undefined;

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe() {
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
}
