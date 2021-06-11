import { Subscription } from 'rxjs';
///  <reference types="@types/spotify-api"/>

import { SpotifyLibrary } from './spotify-library.service';
import { Component, OnInit } from '@angular/core';
import { SpotifyScopes } from './spotify.scopes';

declare global {
  interface Window {
    onSpotifyLogin: (accessToken: string) => void;
  }
}

@Component({
  selector: 'app-song-library',
  templateUrl: './song-library.component.html',
  styleUrls: ['./song-library.component.scss'],
})
export class SongLibraryComponent implements OnInit {
  private _subscription$: Subscription = new Subscription();
  public spotifyUserTracks: SpotifyApi.TrackObjectFull[] = [];
  constructor(public spotifyLibrary: SpotifyLibrary) {}
  ngOnInit(): void {
    this.subscribe();
  }

  public subscribe() {
    this.spotifyLibrary.userTracks$.subscribe(
      (data) => (this.spotifyUserTracks = data)
    );
  }

  public handleAddSpotifyAccountClick = () => {
    this.spotifyLibrary.login();
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
