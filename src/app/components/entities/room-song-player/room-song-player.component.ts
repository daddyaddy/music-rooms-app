import { StoreFacade } from './../../../core/store/store.facade';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { RoomDetail } from 'src/utils';
import { RoomSongPlayerService } from './room-song-player.service';

@Component({
  selector: 'app-room-song-player',
  templateUrl: './room-song-player.component.html',
  styleUrls: ['./room-song-player.component.scss'],
})
export class RoomSongPlayerComponent {
  public _subscription$: Subscription = new Subscription();
  public selectedRoomDetail: RoomDetail;

  constructor(
    private roomSongPlayerService: RoomSongPlayerService,
    private storeFacade: StoreFacade
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.subscribe(), 0);
  }

  public subscribe() {
    const { selectedRoomDetail$ } = this.storeFacade;
    this._subscription$.add(
      selectedRoomDetail$.subscribe((selectedRoomDetail) => {
        this.selectedRoomDetail = selectedRoomDetail;
      })
    );

    const { roomSongPlayerService } = this;
    roomSongPlayerService.songEnded$
      .pipe(
        withLatestFrom(this.storeFacade.selectedRoom$),
        map(([, selectedRoom]) => selectedRoom.roomId)
      )
      .subscribe((roomId) => this.storeFacade.nextRoomSong({ roomId }));

    roomSongPlayerService.newSong$.subscribe((song) => {
      roomSongPlayerService.load(`/assets/${song.source}`);
    });

    roomSongPlayerService.isCurrentSongPlay$.subscribe((isCurrentSongPlay) => {
      isCurrentSongPlay
        ? roomSongPlayerService.play()
        : roomSongPlayerService.pause();
    });
  }

  public handlePreviousButtonClick = () => {
    const { selectedRoomDetail, storeFacade } = this;
    if (!selectedRoomDetail) return;
    storeFacade.prevRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public handleAudioButtonClick = () => {
    const { selectedRoomDetail, storeFacade } = this;
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
