import { RoomsFacade } from 'src/app/store/rooms/rooms.facade';
import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';

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

  constructor(private roomsFacade: RoomsFacade) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscribe();
    }, 0);
  }

  subscribe() {
    this._subscription$.add(
      this.roomsFacade.selectedRoom$.subscribe((data) => {
        this.songs = data.songs;
        this.currentSongIdx = data.currentSongIndex;
      })
    );
    this._subscription$.add(
      this.roomsFacade.selectedRoom$
        .pipe(
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
