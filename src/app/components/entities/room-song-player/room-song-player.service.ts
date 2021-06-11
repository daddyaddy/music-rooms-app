import { WebSocketService } from './../../../core/websocket/websocket.service';
import { BehaviorSubject, combineLatest, fromEvent, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { StoreFacade } from 'src/app/core/store/store.facade';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  mapTo,
} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { ofType, sleep } from 'src/utils';

@Injectable({ providedIn: 'root' })
export class RoomSongPlayerService {
  private audio: HTMLAudioElement;
  private readonly _songBuffers: BehaviorSubject<SongBuffer[]>;
  private readonly _isAudioPlayed: BehaviorSubject<boolean>;
  private readonly _audioCurrentTime: BehaviorSubject<number>;
  private readonly _audioDuration: BehaviorSubject<number>;
  public songBuffers$: Observable<SongBuffer[]>;
  public isAudioPlayed$: Observable<boolean>;
  public audioCurrentTime$: Observable<number>;
  public audioDuration$: Observable<number>;

  public songBlobs$: Observable<SongBlob[]>;
  public currentSongYtId$: Observable<string | undefined>;
  public currentBuffer$: Observable<SongBuffer | undefined>;
  public currentBlob$: Observable<SongBlob | undefined>;

  public audioLoad$: Observable<Event>;
  public audioCanPlay$: Observable<Event>;
  public audioPlay$: Observable<Event>;
  public audioPause$: Observable<Event>;
  public audioTimeUpdate$: Observable<Event>;
  public audioDurationChange$: Observable<Event>;
  public audioEnded$: Observable<Event>;

  public newSong$: Observable<any>;
  public newCurrentSong$: Observable<Song>;
  public isCurrentSongBuffered$: Observable<boolean>;
  public isCurrentSongPlay$: Observable<boolean>;
  public currentSongShouldLoad$: Observable<SongBlob>;
  public currentSongShouldPlay$: Observable<true>;
  public currentSongShouldPause$: Observable<true>;

  constructor(
    private webSocketService: WebSocketService,
    private storeFacade: StoreFacade,
    private sanitizer: DomSanitizer
  ) {
    this.audio = new Audio();
    this._songBuffers = new BehaviorSubject([]);
    this._isAudioPlayed = new BehaviorSubject(false);
    this._audioCurrentTime = new BehaviorSubject(0);
    this._audioDuration = new BehaviorSubject(0);
    this.songBuffers$ = this._songBuffers.asObservable();
    this.isAudioPlayed$ = this._isAudioPlayed.asObservable();
    this.audioCurrentTime$ = this._audioCurrentTime.asObservable();
    this.audioDuration$ = this._audioDuration.asObservable();
    this.serve();
    this.subscribe();
  }

  private serve() {
    const { audio, storeFacade } = this;
    this.songBlobs$ = this.songBuffers$.pipe(
      map((songBuffers) =>
        songBuffers.map((songBuffer) => {
          const { ytId, buffer } = songBuffer;
          const byteArray = new Uint8Array(buffer.data);
          const blob = new Blob([byteArray], { type: 'audio/mp3' });
          return { ytId, blob };
        })
      )
    );
    this.audioEnded$ = fromEvent(audio, 'ended');
    this.audioCanPlay$ = fromEvent(audio, 'canplay');
    this.audioPlay$ = fromEvent(audio, 'play');
    this.audioPause$ = fromEvent(audio, 'pause');
    this.audioTimeUpdate$ = fromEvent(audio, 'timeupdate');
    this.audioDurationChange$ = fromEvent(audio, 'durationchange');
    this.audioLoad$ = fromEvent(audio, 'load');

    this.currentSongYtId$ = this.storeFacade.selectedRoomCurrentSong$.pipe(
      filter((currentSong) => currentSong !== undefined),
      map((currentSong) => currentSong.ytId)
    );
    this.currentBuffer$ = combineLatest([
      this.songBuffers$,
      this.currentSongYtId$,
    ]).pipe(
      map(([songBuffers, currentSongYtId]) =>
        songBuffers.find((buffer) => buffer.ytId === currentSongYtId)
      )
    );
    this.currentBlob$ = combineLatest([
      this.songBlobs$,
      this.currentSongYtId$,
    ]).pipe(
      map(([songBlobs, currentSongYtId]) =>
        songBlobs.find((blob) => blob.ytId === currentSongYtId)
      )
    );
    this.newCurrentSong$ = storeFacade.selectedRoomCurrentSong$.pipe(
      filter((currentSong) => currentSong !== undefined),
      distinctUntilKeyChanged('songId')
    );
    this.isCurrentSongPlay$ = storeFacade.selectedRoomDetail$.pipe(
      filter((selectedRoomDetail) => selectedRoomDetail !== undefined),
      map((selectedRoomDetail) => selectedRoomDetail.isCurrentSongPlay),
      distinctUntilChanged()
    );

    this.newSong$ = storeFacade.selectedRoomSongs$.pipe(
      map((songs) => songs.length),
      distinctUntilChanged()
    );

    this.isCurrentSongBuffered$ = this.currentBuffer$.pipe(
      map((currentBuffer) => currentBuffer !== undefined)
    );
    this.currentSongShouldLoad$ = combineLatest([
      storeFacade.selectedRoomCurrentSong$,
      this.currentBlob$,
    ]).pipe(
      filter(
        ([currentSong, currentBlob]) =>
          currentSong !== undefined && currentBlob !== undefined
      ),
      map(([, currentBlob]) => currentBlob),
      distinctUntilKeyChanged('ytId')
    );

    this.currentSongShouldPause$ = this.isCurrentSongPlay$.pipe(
      distinctUntilChanged((a, b) => a !== b),
      filter((isCurrentSongPlay) => !isCurrentSongPlay),
      mapTo(true)
    );

    this.currentSongShouldPlay$ = combineLatest([
      this.audioCanPlay$,
      this.isCurrentSongPlay$,
    ]).pipe(
      filter(([, isCurrentSongPlay]) => isCurrentSongPlay),
      mapTo(true)
    );
  }

  private subscribe() {
    this.webSocketService.webSocket$
      .pipe(ofType(ServerMessageDataType.DOWNLOAD_SONG_BUFFER_RESPONSE))
      .subscribe(
        (
          messageData: MessageData<
            ServerMessageDataType,
            DownloadSongBufferResponsePayload
          >
        ) => {
          const { songBuffer } = messageData.payload;
          this._songBuffers.next([songBuffer]);
        }
      );

    this.audioPlay$.subscribe((data) => this._isAudioPlayed.next(true));
    this.audioPause$.subscribe((data) => this._isAudioPlayed.next(false));
    this.audioDurationChange$.subscribe((data) => {
      this._audioCurrentTime.next(this.audio.currentTime);
      this._audioDuration.next(this.audio.duration);
    });
    this.audioTimeUpdate$.subscribe((data) => {
      this._audioCurrentTime.next(this.audio.currentTime);
    });
  }

  public downloadSongBuffer(songYtId: string) {
    this.webSocketService.send<DownloadSongBufferPayload>({
      type: ClientMessageDataType.DOWNLOAD_SONG_BUFFER,
      payload: { songYtId },
    });
  }

  public load(songBlob: SongBlob) {
    this.audio.pause();
    const { blob } = songBlob;
    const { sanitizer } = this;
    const blobUrl = URL.createObjectURL(blob);
    const safeBlobUrl = sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.audio.src = blobUrl;
    this.audio.load();
  }

  public play() {
    this.audio.play();
  }

  public pause() {
    this.audio.pause();
  }

  public fastForward() {
    const { currentTime, duration, readyState } = this.audio;
    if (readyState < 3) return;
    this.audio.currentTime =
      currentTime + 10 < duration ? currentTime + 10 : duration - 1;
  }

  public fastBackward() {
    const { currentTime, readyState } = this.audio;
    if (readyState < 2) return;
    this.audio.currentTime = currentTime - 10 > 0 ? currentTime - 10 : 0;
  }

  private async fadeIn() {
    while (this.audio.volume < 1) {
      this.audio.volume =
        this.audio.volume + 0.1 > 1 ? 1 : this.audio.volume + 0.1;
      await sleep(100);
    }
  }

  private async fadeOut() {
    const q = 0.2;
    while (this.audio.volume > 0) {
      this.audio.volume = this.audio.volume - q < 0 ? 0 : this.audio.volume - q;
      await sleep(150);
    }
  }
}
