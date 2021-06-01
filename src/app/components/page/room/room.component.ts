import { OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { RoomDetail } from 'src/utils';
import { StoreFacade } from 'src/app/core/store/store.facade';
import { WindowSongLibraryService } from '../../entities/window-song-library/window-song-library.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnDestroy {
  @ViewChild('addSongButtonRef') addSongButtonRef;
  private _subscription$: Subscription = new Subscription();
  private addSongButtonClick$: Observable<MouseEvent>;
  public selectedRoomDetail: RoomDetail | undefined = undefined;
  public isExistHost: boolean = false;
  public isCurrentUserIsHost: boolean = false;

  constructor(
    private storeFacade: StoreFacade,
    private windowSongLibraryService: WindowSongLibraryService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.serve();
      this.subscribe();
    }, 0);
  }

  private serve(): void {
    this.addSongButtonClick$ = fromEvent(
      this.addSongButtonRef.nativeElement,
      'click'
    );
  }

  private subscribe(): void {
    this._subscription$.add(
      this.storeFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.isSelectedRoomHostUserInsideRoom$.subscribe((data) => {
        this.isExistHost = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.isCurrentClientIsHost$.subscribe((data) => {
        this.isCurrentUserIsHost = data;
      })
    );
    this._subscription$.add(
      this.addSongButtonClick$.subscribe((data) => {
        this.windowSongLibraryService.openWindow();
      })
    );
  }

  handleBecomeHostButtonClick = (): void => {
    if (!this.selectedRoomDetail) return;
    const { roomId } = this.selectedRoomDetail;
    this.storeFacade.becomeHost({ roomId });
  };

  handleRoomButtonClick = (): void => {
    this.storeFacade.leftRoom();
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
