import { Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { StoreFacade } from 'src/app/core/store/store.facade';
import { RoomDetail } from 'src/utils';
import { WindowRoomCreatorService } from '../../entities/window-room-creator/window-room-creator.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  @ViewChild('createRoomButtonRef') createRoomButtonRef;
  private _subscription$: Subscription = new Subscription();
  private createRoomButtonClick$: Observable<MouseEvent>;
  public roomsDetails: RoomDetail[] = [];

  constructor(
    private windowRoomCreatorService: WindowRoomCreatorService,
    private storeFacade: StoreFacade
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.serve();
      this.subscribe();
    }, 0);
  }

  private serve(): void {
    this.createRoomButtonClick$ = fromEvent(
      this.createRoomButtonRef.nativeElement,
      'click'
    );
  }

  private subscribe(): void {
    this.createRoomButtonClick$.subscribe((data) => {
      this.windowRoomCreatorService.openWindow();
    });

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
