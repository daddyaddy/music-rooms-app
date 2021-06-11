///  <reference types="@types/spotify-api"/>

import { filter, switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, defer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/core/websocket/websocket.service';
import { SpotifyScopes } from './spotify.scopes';

@Injectable({ providedIn: 'root' })
export class SpotifyLibrary {
  private readonly apiUrl: string = environment.spotifyApiUrl;
  private readonly accountUrl: string = environment.spotifyAccountUrl;
  private readonly clientID: string = '825bbd87d0194968b662027f32d0c11e';

  private readonly _accessToken: BehaviorSubject<string | undefined>;
  public readonly accessToken$: Observable<string | undefined>;

  private readonly _userTracks: BehaviorSubject<SpotifyApi.TrackObjectFull[]>;
  public readonly userTracks$: Observable<SpotifyApi.TrackObjectFull[]>;

  constructor(
    public http: HttpClient,
    public webSocketService: WebSocketService
  ) {
    this._accessToken = new BehaviorSubject(undefined);
    this.accessToken$ = this._accessToken.asObservable();

    this._userTracks = new BehaviorSubject([]);
    this.userTracks$ = this._userTracks.asObservable();
    this.subscribe();
  }

  private subscribe() {
    this.accessToken$
      .pipe(
        filter((accessToken) => accessToken !== undefined),
        switchMap((accessToken) => this.fetchUserTracks({ accessToken }))
      )
      .subscribe((data) => this._userTracks.next(data));
  }

  public login() {
    const { clientID } = this;
    const redirectUrl = this.getRedirectUrl({
      clientID,
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
      redirectUrl,
      'Login with Spotify',
      'width=800,height=600'
    );

    window.onSpotifyLogin = (accessToken) => {
      popup.close();
      this._accessToken.next(accessToken);
    };
  }

  private getRedirectUrl = (payload: {
    clientID: string;
    scopes: SpotifyScopes[];
    redirectUri: string;
    showDialog: boolean;
  }): string => {
    const { clientID, scopes, redirectUri, showDialog } = payload;
    return (
      `${this.accountUrl}/authorize?response_type=token` +
      `&client_id=${clientID}` +
      `&scope=${scopes.join('%20')}` +
      `&redirect_uri=${redirectUri}` +
      `&show_dialog=${showDialog}`
    );
  };

  private fetchUserTracks(payload: {
    accessToken: string;
  }): Observable<SpotifyApi.TrackObjectFull[]> {
    return defer(() => {
      const { accessToken } = payload;
      console.log(accessToken);
      const url = `${this.apiUrl}/me/tracks?offset=0&limit=20`;
      const fetchUserTracks$ = this.http
        .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        .pipe(
          map((res: SpotifyApi.UsersSavedTracksResponse) =>
            res.items.map((item) => item.track)
          )
        );
      return fetchUserTracks$;
    });
  }
}
