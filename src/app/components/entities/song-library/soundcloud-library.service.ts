import { SoundCloudUser } from './../../page/soundcloud-auth/soundcloud-auth.component';
///  <reference types="@types/spotify-api"/>
import { LocalstorageService } from './../../../core/localstorage/localstorage';

import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/core/websocket/websocket.service';
import { SpotifyScopes } from './spotify.scopes';
import { encode, decode } from 'js-base64';

export type SoundCloudTrack = {
  access: string;
  artwork_url: string;
  available_country_codes: null;
  bpm: null;
  comment_count: number;
  commentable: boolean;
  created_at: Date;
  description: string;
  download_count: number;
  download_url: string;
  downloadable: false;
  duration: number;
  embeddable_by: string;
  favoritings_count: number;
  genre: string;
  id: number;
  isrc: string | null;
  key_signature: string | null;
  kind: string;
  label_name: string | null;
  license: string;
  monetization_model: null;
  permalink_url: string;
  playback_count: number;
  policy: null;
  purchase_title: null;
  purchase_url: string;
  release: null;
  release_day: null;
  release_month: null;
  release_year: null;
  reposts_count: number;
  secret_uri: null;
  sharing: string;
  stream_url: string;
  streamable: boolean;
  tag_list: string;
  title: string;
  uri: string;
  user: SoundCloudUser;
  user_favorite: null;
  user_playback_count: null;
  waveform_url: string;
};

declare global {
  interface Window {
    onSoundCloudLogin: (userId: number) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class SoundCloudLibrary {
  private readonly apiUrl: string = environment.soundCloudApiUrl;
  private readonly clientID: string = 'wpfE1K2Teq4ZQ0QxdOuzIPTQUrcPO9P6';

  private readonly _userId: BehaviorSubject<number | undefined>;
  public readonly userId$: Observable<number | undefined>;

  private readonly _userSongs: BehaviorSubject<Song[]>;
  public readonly userSongs$: Observable<Song[]>;

  constructor(
    public http: HttpClient,
    public webSocketService: WebSocketService,
    public localstorageService: LocalstorageService
  ) {
    this._userId = new BehaviorSubject(undefined);
    this.userId$ = this._userId.asObservable();

    this._userSongs = new BehaviorSubject([]);
    this.userSongs$ = this._userSongs.asObservable();

    this.subscribe();
  }

  private subscribe() {
    this.localstorageService.localstorage$.pipe(take(1)).subscribe((data) => {
      this._userId.next(data.soundCloudUserId);
    });
  }

  public getAuthorizationUrl = (payload: {
    clientID: string;
    redirectUri: string;
  }) => {
    const { clientID, redirectUri } = payload;
    return `/soundcloud-auth?client_id=${clientID}&redirect_uri=${redirectUri}`;
  };

  public login() {
    const { clientID } = this;
    const authorizationUrl = this.getAuthorizationUrl({
      clientID: clientID,
      redirectUri: 'http://localhost:4200/soundcloud-callback',
    });

    const popup = window.open(
      authorizationUrl,
      'Login with SoundCloud',
      'width=400,height=600'
    );

    window.onSoundCloudLogin = (userId: number | undefined) => {
      popup.close();
      if (!userId) this._userId.next(undefined);
      this.localstorageService.setStorage({ soundCloudUserId: userId });
      this._userId.next(userId);
    };
  }

  public fetchUserTracks$(payload: {
    userId: number;
    offset?: number;
  }): Observable<Song[]> {
    const { userId, offset } = payload;
    const { clientID } = this;
    const url = `${this.apiUrl}/users/${userId}/likes/tracks?offset=${offset}&limit=50&client_id=${clientID}`;
    const fetchUserTracks$ = this.http.get<SoundCloudTrack[]>(url, {}).pipe(
      map((tracks) =>
        tracks.map((track) => ({
          songId: String(track.id),
          author: track.user.username,
          title: track.title,
          cover: track.artwork_url,
        }))
      )
    );

    return fetchUserTracks$;
  }

  public setUserTracks(userSongs: Song[]) {
    this._userSongs.next([...userSongs]);
  }
}
