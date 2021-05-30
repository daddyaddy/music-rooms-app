import { WindowRoomSongLibraryService } from './../window-room-song-library/window-room-song-library.service';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-room-song-input',
  templateUrl: './room-song-input.component.html',
  styleUrls: ['./room-song-input.component.scss'],
})
export class RoomSongInputComponent implements OnInit, OnDestroy {
  @ViewChild('songInputRef') songInputRef;
  @ViewChild('addSongButtonRef') addSongButtonRef;
  private _subscription$: Subscription = new Subscription();
  private songInputValue$: Observable<string>;
  private addSongButtonClick$: Observable<MouseEvent>;
  private submitFormPending$: Observable<string>;
  private submitFormSuccess$: Observable<RoomSong | undefined>;

  constructor(
    private windowRoomSongLibraryService: WindowRoomSongLibraryService,
    private storeFacade: StoreFacade
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.serve();
    this.subscribe();
  }

  private serve(): void {
    this.songInputValue$ = fromEvent(
      this.songInputRef.nativeElement,
      'keyup'
    ).pipe(map((event: MouseEvent) => (event.target as any).value));

    this.addSongButtonClick$ = fromEvent(
      this.addSongButtonRef.nativeElement,
      'click'
    );
  }

  private subscribe(): void {
    this._subscription$.add(
      this.addSongButtonClick$.subscribe((data) => {
        this.windowRoomSongLibraryService.openWindow();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
