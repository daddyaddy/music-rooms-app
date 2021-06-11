import { StoreFacade } from './../../../core/store/store.facade';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { map, filter, withLatestFrom } from 'rxjs/operators';
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
  public audioStatus: 'pause' | 'pending' | 'play' = 'pause';
  public currentTime: number = 0;
  public duration: number = 0;

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
    roomSongPlayerService.audioEnded$
      .pipe(
        withLatestFrom(this.storeFacade.selectedRoom$),
        map(([, selectedRoom]) => selectedRoom.roomId)
      )
      .subscribe((roomId) => this.storeFacade.nextRoomSong({ roomId }));

    roomSongPlayerService.newCurrentSong$
      .pipe(
        withLatestFrom(this.roomSongPlayerService.currentBlob$),
        filter(([, currentBlob]) => currentBlob === undefined)
      )
      .subscribe(([newSong]) => {
        roomSongPlayerService.downloadSongBuffer(newSong.ytId);
      });

    roomSongPlayerService.currentSongShouldLoad$.subscribe((currentBlob) => {
      roomSongPlayerService.load(currentBlob);
    });

    roomSongPlayerService.currentSongShouldPlay$.subscribe(() => {
      roomSongPlayerService.play();
    });

    roomSongPlayerService.newSong$.subscribe(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    roomSongPlayerService.newCurrentSong$.subscribe(async () => {
      await roomSongPlayerService.pause();
    });
    roomSongPlayerService.currentSongShouldPause$.subscribe(async () => {
      await roomSongPlayerService.pause();
    });

    combineLatest([
      roomSongPlayerService.isCurrentSongPlay$,
      roomSongPlayerService.isAudioPlayed$,
    ])
      .pipe(
        map(([isCurrentSongPlay, isAudioPlayed]) =>
          isCurrentSongPlay ? (isAudioPlayed ? 'play' : 'pending') : 'pause'
        )
      )
      .subscribe((data) => (this.audioStatus = data));

    roomSongPlayerService.audioCurrentTime$.subscribe(
      (data) => (this.currentTime = data)
    );
    roomSongPlayerService.audioDuration$.subscribe(
      (data) => (this.duration = data)
    );
  }

  public handlePreviousButtonClick = () => {
    const { selectedRoomDetail, storeFacade } = this;
    if (!selectedRoomDetail) return;
    storeFacade.prevRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public handleFastBackwardButtonClick = () => {
    const { roomSongPlayerService } = this;
    roomSongPlayerService.fastBackward();
  };

  public handleAudioButtonClick = () => {
    const { selectedRoomDetail, storeFacade } = this;
    if (!selectedRoomDetail) return;
    !selectedRoomDetail.isCurrentSongPlay &&
      this.storeFacade.playRoomSong({ roomId: selectedRoomDetail.roomId });
    selectedRoomDetail.isCurrentSongPlay &&
      this.storeFacade.pauseRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public handleFastForwardButtonClick = () => {
    const { roomSongPlayerService } = this;
    roomSongPlayerService.fastForward();
  };

  public handleNextButtonClick = () => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return;
    this.storeFacade.nextRoomSong({ roomId: selectedRoomDetail.roomId });
  };

  public isPreviousButtonDisabled = (): boolean => {
    const { selectedRoomDetail } = this;
    if (!selectedRoomDetail) return true;
    return selectedRoomDetail.currentSongIndex - 1 < 0;
  };

  public isFastBackwardButtonDisabled = (): boolean => {
    const { selectedRoomDetail, audioStatus } = this;
    if (!selectedRoomDetail) return audioStatus !== 'pending';
  };

  public getAudioStatusButtonClass = (): string => {
    const { audioStatus } = this;
    if (audioStatus === 'pause') return 'icon-play';
    if (audioStatus === 'pending') return 'icon-spin6';
    if (audioStatus === 'play') return 'icon-pause';
  };

  public isFastForwardButtonDisabled = (): boolean => {
    const { selectedRoomDetail, audioStatus } = this;
    if (!selectedRoomDetail) return audioStatus !== 'pending';
  };

  public isNextButtonDisabled = (): boolean => {
    const { selectedRoomDetail } = this;
    if (!this.selectedRoomDetail) return true;
    return (
      selectedRoomDetail.currentSongIndex + 1 >
      selectedRoomDetail.songs.length - 1
    );
  };

  public getAudioTimeProgress = () => {
    const { currentTime, duration } = this;
    if (!duration) return `${0}%`;
    else return `${(currentTime / duration) * 100}%`;
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
