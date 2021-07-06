///  <reference types="@types/spotify-api"/>
import { LocalstorageService } from './../../../core/localstorage/localstorage';

import { distinctUntilChanged, take } from 'rxjs/operators';
import { getFormBody } from './../../../../utils/index';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, defer, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/core/websocket/websocket.service';
import { SpotifyScopes } from './spotify.scopes';
import { encode, decode } from 'js-base64';

type SpotifyTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type ExpiringToken = {
  token: string;
  expirationAt: number;
};

declare global {
  interface Window {
    onSpotifyLogin: (accessToken: string | undefined) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class SpotifyLibrary {
  private readonly apiUrl: string = environment.spotifyApiUrl;
  private readonly accountUrl: string = environment.spotifyAccountUrl;
  private readonly clientID: string = '825bbd87d0194968b662027f32d0c11e';
  private readonly clientSecret: string = '747c5ac6892f487c8860dc8419321e6b';

  private readonly _code: BehaviorSubject<string | undefined>;
  public readonly code$: Observable<string | undefined>;

  private readonly _accessToken: BehaviorSubject<ExpiringToken | undefined>;
  public readonly accessToken$: Observable<ExpiringToken | undefined>;

  private readonly _refreshToken: BehaviorSubject<string | undefined>;
  public readonly refreshToken$: Observable<string | undefined>;

  private readonly _userSongs: BehaviorSubject<Song[]>;
  public readonly userSongs$: Observable<Song[]>;

  public readonly accessTokenNeedBeRefreshed$: Observable<string>;
  public readonly isAccessTokenExpired$: Observable<boolean>;

  constructor(
    public http: HttpClient,
    public webSocketService: WebSocketService,
    public localstorageService: LocalstorageService
  ) {
    this._code = new BehaviorSubject(undefined);
    this.code$ = this._code.asObservable();

    this._accessToken = new BehaviorSubject(undefined);
    this.accessToken$ = this._accessToken.asObservable();

    this._refreshToken = new BehaviorSubject(undefined);
    this.refreshToken$ = this._refreshToken.asObservable();

    this._userSongs = new BehaviorSubject([]);
    this.userSongs$ = this._userSongs.asObservable();

    this.isAccessTokenExpired$ = interval(60000).pipe(
      withLatestFrom(this.accessToken$),
      filter(
        ([tick, accessTokenExpiration]) => accessTokenExpiration !== undefined
      ),
      map(
        ([tick, accessTokenExpiration]) =>
          accessTokenExpiration &&
          Date.now() >= accessTokenExpiration.expirationAt
      ),
      distinctUntilChanged()
    );

    this.accessTokenNeedBeRefreshed$ = this.isAccessTokenExpired$.pipe(
      filter((isAccessTokenExpired) => isAccessTokenExpired),
      withLatestFrom(this.refreshToken$),
      map(([, refreshToken]) => refreshToken)
    );

    this.subscribe();
  }

  private subscribe() {
    this.localstorageService.localstorage$.pipe(take(1)).subscribe((data) => {
      this._refreshToken.next(data.spotifyRefreshToken);
      this._accessToken.next(data.spotifyAccessToken);
    });
  }

  public login() {
    const { clientID } = this;
    const authorizationUrl = this.getAuthorizationUrl({
      clientID,
      response_type: 'code',
      scopes: [
        SpotifyScopes.userReadEmail,
        SpotifyScopes.playlistReadPrivate,
        SpotifyScopes.userLibraryRead,
        SpotifyScopes.userLibraryModify,
      ],
      redirectUri: 'http://localhost:4200/spotify-callback',
      showDialog: true,
    });

    const popup = window.open(
      authorizationUrl,
      'Login with Spotify',
      'width=400,height=600'
    );

    window.onSpotifyLogin = (code: string | undefined) => {
      popup.close();
      if (!code) this._code.next(undefined);
      this._code.next(code);
    };
  }

  private getAuthorizationUrl = (payload: {
    clientID: string;
    response_type: 'token' | 'code';
    scopes: SpotifyScopes[];
    redirectUri: string;
    showDialog: boolean;
  }): string => {
    const { clientID, scopes, redirectUri, showDialog, response_type } =
      payload;
    return (
      `${this.accountUrl}/authorize?response_type=${response_type}` +
      `&client_id=${clientID}` +
      `&scope=${scopes.join('%20')}` +
      `&redirect_uri=${redirectUri}` +
      `&show_dialog=${showDialog}`
    );
  };

  public fetchTokens$(payload: {
    code: string;
  }): Observable<SpotifyTokenResponse> {
    const { clientID, clientSecret } = this;
    const { code } = payload;
    const url = `${this.accountUrl}/api/token`;
    const grant_type = `authorization_code`;
    const redirect_uri = `http://localhost:4200/spotify-callback`;
    const fetchRefreshToken$ = this.http.post<SpotifyTokenResponse>(
      url,
      `code=${code}&redirect_uri=${redirect_uri}&grant_type=${grant_type}`,
      {
        headers: {
          Authorization: `Basic ${encode(`${clientID}:${clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      }
    );

    return fetchRefreshToken$;
  }

  public fetchRefreshingToken$(payload: {
    refreshToken: string;
  }): Observable<SpotifyTokenResponse> {
    const { clientID, clientSecret } = this;
    const { refreshToken } = payload;
    const url = `${this.accountUrl}/api/token`;
    const grant_type = `refresh_token`;
    const fetchRefreshToken$ = this.http.post<SpotifyTokenResponse>(
      url,
      `grant_type=${grant_type}&refresh_token=${refreshToken}`,
      {
        headers: {
          Authorization: `Basic ${encode(`${clientID}:${clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      }
    );

    return fetchRefreshToken$;
  }

  public fetchUserTracks$(payload: {
    accessToken: string;
    offset?: number;
  }): Observable<Song[]> {
    const { accessToken, offset } = payload;
    const url = `${this.apiUrl}/me/tracks?offset=${offset || 0}&limit=50`;
    const fetchUserTracks$ = this.http
      .get<SpotifyApi.UsersSavedTracksResponse>(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        map((res) =>
          res.items
            .map((item) => item.track)
            .map((track) => ({
              songId: track.id,
              author: track.artists.map((artist) => artist.name).join(' & '),
              title: track.name,
              cover: track.album.images[0].url,
            }))
        )
      );
    return fetchUserTracks$;
  }

  public setAccessToken(payload: { accessToken: string }) {
    const accessToken: ExpiringToken = {
      token: payload.accessToken,
      expirationAt: Date.now() + 1000 * 3600,
    };
    this._accessToken.next(accessToken);
    this.localstorageService.setStorage({ spotifyAccessToken: accessToken });
  }

  public setRefreshToken(payload: { refreshToken: string }) {
    const { refreshToken } = payload;
    this._refreshToken.next(refreshToken);
    this.localstorageService.setStorage({ spotifyRefreshToken: refreshToken });
  }

  public setUserTracks(userSongs: Song[]) {
    this._userSongs.next([...userSongs]);
  }
}
