import { StoreFacade } from './../../../core/store/store.facade';
import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { map, distinctUntilChanged, delay, filter } from 'rxjs/operators';

@Component({
  selector: 'app-room-song-previews',
  templateUrl: './room-song-previews.component.html',
  styleUrls: ['./room-song-previews.component.scss'],
})
export class RoomSongPreviewsComponent implements OnInit, OnDestroy {
  @ViewChild('roomSongPreviews') private roomSongPreviews: ElementRef;
  private _subscription$: Subscription = new Subscription();
  public currentSongIdx: number = -1;
  public songs: RoomSong[] = [];

  constructor(private storeFacade: StoreFacade) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscribe();
    }, 0);
  }

  subscribe() {
    this._subscription$.add(
      this.storeFacade.selectedRoom$.subscribe((data) => {
        this.songs = data ? data.songs : [];
        this.currentSongIdx = data ? data.currentSongIndex : -1;
      })
    );
    this._subscription$.add(
      this.storeFacade.selectedRoom$
        .pipe(
          filter((selectedRoom) => selectedRoom !== undefined),
          map((selectedRoom) => selectedRoom.songs.length),
          distinctUntilChanged(),
          delay(100)
        )
        .subscribe((data) => {
          this.scrollToBottom();
        })
    );
  }

  scrollToBottom(): void {
    try {
      this.roomSongPreviews.nativeElement.scrollTop =
        this.roomSongPreviews.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
