///  <reference types="@types/spotify-api"/>
import { LocalstorageService } from './../../../core/localstorage/localstorage';

import { distinctUntilChanged, take } from 'rxjs/operators';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/core/websocket/websocket.service';
import { encode, decode } from 'js-base64';
import { GoogleScopes } from './google.scopes';

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
    onYouTubeLogin: (accessToken: string | undefined) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class YouTubeLibrary {
  private readonly apiUrl: string = environment.googleApiUrl;
  private readonly accountsGoogleUrl: string = 'https://accounts.google.com';
  private readonly clientID: string =
    '356684973396-6evd2tg8rnt791d90qtn12f26hjmk3pn.apps.googleusercontent.com';
  private readonly clientSecret: string = 'UV50AvtgzJ54nAtvt_OWlVxF';

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
      //this._refreshToken.next(data.spotifyRefreshToken);
      this._accessToken.next(data.youTubeAccessToken);
    });
  }

  public login() {
    const { clientID } = this;
    const authorizationUrl = this.getAuthorizationUrl({
      clientID,
      response_type: 'code',
      scopes: [GoogleScopes.youtube_readonly, GoogleScopes.youtube_force_ssl],
      redirectUri: 'http://localhost:4200/youtube-callback',
      showDialog: true,
    });

    const popup = window.open(
      authorizationUrl,
      'Login with YouTube',
      'width=400,height=600'
    );

    window.onYouTubeLogin = (code: string | undefined) => {
      popup.close();
      if (!code) this._code.next(undefined);
      this._code.next(code);
    };
  }

  private getAuthorizationUrl = (payload: {
    clientID: string;
    response_type: 'token' | 'code';
    scopes: GoogleScopes[];
    redirectUri: string;
    showDialog: boolean;
  }): string => {
    const { clientID, scopes, redirectUri, showDialog, response_type } =
      payload;
    return (
      `${this.accountsGoogleUrl}/o/oauth2/v2/auth?response_type=${response_type}` +
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
    const url = `${environment.oauthGoogleApis}/token`;
    const grant_type = `authorization_code`;
    const redirect_uri = `http://localhost:4200/youtube-callback`;
    const fetchRefreshToken$ = this.http.post<SpotifyTokenResponse>(
      url,
      `client_id=${clientID}&client_secret=${clientSecret}&code=${code}&redirect_uri=${redirect_uri}&grant_type=${grant_type}&access_type=offline&prompt=consent`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return fetchRefreshToken$;
  }

  public fetchRefreshingToken$(payload: {
    refreshToken: string;
  }): Observable<SpotifyTokenResponse> {
    const { clientID, clientSecret } = this;
    const { refreshToken } = payload;
    const url = `${environment.oauthGoogleApis}/api/token`;
    const grant_type = `refresh_token`;
    const fetchRefreshToken$ = this.http.post<SpotifyTokenResponse>(
      url,
      `client_id=${clientID}&client_secret=${clientSecret}&grant_type=${grant_type}&refresh_token=${refreshToken}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return fetchRefreshToken$;
  }

  public fetchUserTracks$(payload: {
    accessToken: string;
    offset?: number;
  }): Observable<Song[]> {
    const { accessToken, offset } = payload;
    const url = `${environment.ytApiUrl}/videos?myRating=like&part=snippet&maxResults=50`;
    const fetchUserTracks$ = this.http
      .get<{ items: YtItem[] }>(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        map((res) =>
          res.items.map((video) => ({
            songId: video.id.videoId,
            ytId: video.id.videoId,
            author: video.snippet.channelTitle,
            title: video.snippet.title.replace(video.snippet.channelTitle, ''),
            cover: video.snippet.thumbnails.default.url,
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
    this.localstorageService.setStorage({ youTubeAccessToken: accessToken });
  }

  public setRefreshToken(payload: { refreshToken: string }) {
    const { refreshToken } = payload;
    this._refreshToken.next(refreshToken);
    this.localstorageService.setStorage({ youTubeRefreshToken: refreshToken });
  }

  public setUserTracks(userSongs: Song[]) {
    this._userSongs.next([...userSongs]);
  }
}
