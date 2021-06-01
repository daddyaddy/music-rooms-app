import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { StoreFacade } from 'src/app/core/store/store.facade';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoomSongPlayerService {
  private audio: HTMLAudioElement = new Audio();
  public songEnded$: Observable<Event>;
  public newSong$: Observable<Song>;
  public isCurrentSongPlay$: Observable<boolean>;

  constructor(private storeFacade: StoreFacade) {
    const { audio } = this;
    this.songEnded$ = fromEvent(audio, 'ended');
    this.newSong$ = storeFacade.selectedRoomCurrentSong$.pipe(
      filter((currentSong) => currentSong !== undefined),
      distinctUntilKeyChanged('songId')
    );
    this.isCurrentSongPlay$ = storeFacade.selectedRoomDetail$.pipe(
      filter((selectedRoomDetail) => selectedRoomDetail !== undefined),
      map((selectedRoomDetail) => selectedRoomDetail.isCurrentSongPlay)
    );
  }

  public load(src: string) {
    this.audio.pause();
    this.audio.src = src;
    this.audio.load();
  }

  public play() {
    this.audio.play();
  }

  public pause() {
    this.audio.pause();
  }
}
