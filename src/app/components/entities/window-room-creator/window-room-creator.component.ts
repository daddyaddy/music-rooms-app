import { fromEvent, Observable, Subscription } from 'rxjs';
import { WindowRoomCreatorService } from './window-room-creator.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-window-room-creator',
  templateUrl: './window-room-creator.component.html',
  styleUrls: ['./window-room-creator.component.scss'],
})
export class WindowRoomCreatorComponent implements OnInit, OnDestroy {
  @ViewChild('roomNameInputRef') roomNameInputRef;
  @ViewChild('createRoomButtonRef') createRoomButtonRef;
  private _subscription$: Subscription = new Subscription();

  private roomNameInputValue$: Observable<string>;
  private createRoomButtonClick$: Observable<MouseEvent>;
  private isCreateRoomButtonDisabled$: Observable<boolean>;
  private submitForm$: Observable<string>;

  public isCreateRoomButtonDisabled: boolean = true;
  public isWindowOpened: boolean = false;

  constructor(
    private windowRoomCreatorService: WindowRoomCreatorService,
    private roomsFacade: StoreFacade
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.serve();
    this.subscribe();
  }

  private serve(): void {
    this.roomNameInputValue$ = fromEvent(
      this.roomNameInputRef.nativeElement,
      'keyup'
    ).pipe(map((event: MouseEvent) => (event.target as any).value));

    this.createRoomButtonClick$ = fromEvent(
      this.createRoomButtonRef.nativeElement,
      'click'
    );

    this.submitForm$ = this.createRoomButtonClick$.pipe(
      withLatestFrom(this.roomNameInputValue$),
      map(([createRoomButtonClick, roomNameInputValue]) => roomNameInputValue)
    );

    this.isCreateRoomButtonDisabled$ = this.roomNameInputValue$.pipe(
      map((value: string) => value.length < 3 || value.length > 18)
    );
  }

  private subscribe(): void {
    this._subscription$.add(
      this.isCreateRoomButtonDisabled$.subscribe((data) => {
        this.isCreateRoomButtonDisabled = data;
      })
    );
    this._subscription$.add(
      this.submitForm$.subscribe((roomName) => {
        this.roomsFacade.createRoom({ roomName });
        this.windowRoomCreatorService.closeWindow();
      })
    );
    this._subscription$.add(
      this.windowRoomCreatorService.isWindowOpened$.subscribe((data) => {
        this.isWindowOpened = data;
      })
    );
  }

  public handleCloseWindow(): void {
    this.windowRoomCreatorService.closeWindow();
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
