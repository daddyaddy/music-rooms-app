import { fromEvent, Subscription } from 'rxjs';
import { RoomsFacade } from 'src/app/store/rooms/rooms.facade';
import { Component, Input, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
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
  constructor(private roomsFacade: RoomsFacade) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.serve();
      this.subscribe();
    }, 0);
  }

  public serve() {
    fromEvent(this.audio, 'ended')
      .pipe(withLatestFrom(this.roomsFacade.selectedRoom$))
      .subscribe(([event, selectedRoom]) => {
        this.roomsFacade.nextRoomSong(selectedRoom.roomId);
      });
    this.roomsFacade.selectedRoomCurrentSong$
      .pipe(
        filter((currentSong) => currentSong !== undefined),
        distinctUntilKeyChanged('id')
      )
      .subscribe((song) => {
        this.audio.pause();
        this.audio.src = './assets/' + song.sourceUrl;
      });

    this.roomsFacade.selectedRoomDetail$
      .pipe(
        map((selectedRoomDetail) => selectedRoomDetail.isCurrentSongPlay),
        filter((isCurrentSongPlay) => isCurrentSongPlay === true)
      )
      .subscribe((data) => {
        this.audio.play();
      });

    this.roomsFacade.selectedRoomDetail$
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
      this.roomsFacade.selectedRoomDetail$.subscribe((data) => {
        this.selectedRoomDetail = data;
      })
    );
  }

  public handlePreviousButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    this.roomsFacade.prevRoomSong(selectedRoomDetail.roomId);
  };

  public handleAudioButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    !selectedRoomDetail.isCurrentSongPlay &&
      this.roomsFacade.playRoomSong(selectedRoomDetail.roomId);
    selectedRoomDetail.isCurrentSongPlay &&
      this.roomsFacade.pauseRoomSong(selectedRoomDetail.roomId);
  };

  public handleNextButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    this.roomsFacade.nextRoomSong(selectedRoomDetail.roomId);
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
