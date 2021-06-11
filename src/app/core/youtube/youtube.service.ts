import { environment } from './../../../environments/environment';
import { WebSocketService } from './../websocket/websocket.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable, BehaviorSubject } from 'rxjs';
import { delay, finalize, map } from 'rxjs/operators';
import { ofType } from 'src/utils';

@Injectable({ providedIn: 'root' })
export class YoutubeService {
  private readonly apiUrl: string = environment.ytApiUrl;
  private readonly apiKey: string = 'AIzaSyCXUGs1WNAshhdPBAfTB66oLLpcN-RIIvM';
  private readonly _isSearchPending: BehaviorSubject<boolean>;
  private readonly _songProgress$: BehaviorSubject<SongProgress | undefined>;
  public isSearchPending$: Observable<boolean>;
  public isAddSongPending$: Observable<boolean>;
  public songProgress$: Observable<SongProgress>;
  public fetchItems$: Observable<YtItem[]>;

  constructor(
    public http: HttpClient,
    public webSocketService: WebSocketService
  ) {
    this._isSearchPending = new BehaviorSubject(false);
    this._songProgress$ = new BehaviorSubject(undefined);
    this.isSearchPending$ = this._isSearchPending.asObservable();
    this.isAddSongPending$ = this.webSocketService.isPending$(
      ClientMessageDataType.ADD_ROOM_SONG
    );
    this.songProgress$ = this._songProgress$.asObservable();
    this.subscribe();
  }

  private subscribe() {
    this.webSocketService.webSocket$
      .pipe(ofType(ServerMessageDataType.UPLOAD_SONG_PROGRESS))
      .subscribe(
        (
          messageData: MessageData<
            ServerMessageDataType,
            UploadSongProgressPayload
          >
        ) => {
          const { songProgress } = messageData.payload;
          this._songProgress$.next(songProgress);
        }
      );
  }

  public fetchItemsBy(query: string): Observable<YtItem[]> {
    return defer(() => {
      this._isSearchPending.next(true);
      this._songProgress$.next(undefined);
      const url = `${this.apiUrl}?q=${query}&key=${this.apiKey}&part=snippet&type=video&maxResults=5`;
      this.fetchItems$ = this.http.get(url).pipe(
        delay(2000),
        map((response: any) => response.items),
        finalize(() => this._isSearchPending.next(false))
      );
      return this.fetchItems$;
    });
  }
}
