import { StoreFacade } from './../../../core/store/store.facade';
import { fromEvent, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  withLatestFrom,
} from 'rxjs/operators';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-room-song-player',
  templateUrl: './room-song-player.component.html',
  styleUrls: ['./room-song-player.component.scss'],
})
export class RoomSongPlayerComponent implements OnInit {
  public audio: HTMLAudioElement = new Audio();
  public _subscription$: Subscription = new Subscription();
  public selectedRoomDetail: RoomDetail;
  public currentSong: Song;
  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.serve();
      this.subscribe();
    }, 0);
  }

  public serve() {
    fromEvent(this.audio, 'ended')
      .pipe(withLatestFrom(this.storeFacade.selectedRoom$))
      .subscribe(([event, selectedRoom]) => {
        this.storeFacade.nextRoomSong({ roomId: selectedRoom.roomId });
      });
    this.storeFacade.selectedRoomCurrentSong$
      .pipe(
        filter((currentSong) => currentSong !== undefined),
        distinctUntilKeyChanged('songId')
      )
      .subscribe((song) => {
        this.audio.pause();
        this.audio.src = './assets/' + song.source;
        this.audio.load();
      });

    this.storeFacade.selectedRoomDetail$
      .pipe(
        map((selectedRoomDetail) => selectedRoomDetail.isCurrentSongPlay),
        filter((isCurrentSongPlay) => isCurrentSongPlay === true)
      )
      .subscribe((data) => {
        this.audio.play();
      });

    this.storeFacade.selectedRoomDetail$
      .pipe(
        map((selectedRoomDetail) => selectedRoomDetail.isCurrentSongPlay),
        filter((isCurrentSongPlay) => isCurrentSongPlay === false)
      )
      .subscribe((data) => {
        this.audio.pause();
      });
  }

  public subscribe() {
    this._subscription$.add(
      this.storeFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
  }

  public handlePreviousButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    this.storeFacade.prevRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public handleAudioButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    !selectedRoomDetail.isCurrentSongPlay &&
      this.storeFacade.playRoomSong({ roomId: selectedRoomDetail.roomId });
    selectedRoomDetail.isCurrentSongPlay &&
      this.storeFacade.pauseRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public handleNextButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    this.storeFacade.nextRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public getAudioStatusButtonClass = (): string => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return 'icon-play';
    return selectedRoomDetail.isCurrentSongPlay ? 'icon-pause' : 'icon-play';
  };

  public isPreviousButtonDisabled = (): boolean => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return true;
    return selectedRoomDetail.currentSongIndex - 1 < 0;
  };

  public isNextButtonDisabled = (): boolean => {
    const { selectedRoomDetail } = this;
    if (!this.selectedRoomDetail) return true;
    return (
      selectedRoomDetail.currentSongIndex + 1 >
      selectedRoomDetail.songs.length - 1
    );
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
