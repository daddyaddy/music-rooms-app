///  <reference types="@types/spotify-api"/>

import { YouTubeLibrary } from './youtube-library.service';
import { SongLibraryService } from './song-library.service';
import { forkJoin, interval, Subscription } from 'rxjs';
import { SpotifyLibrary } from './spotify-library.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FolderType } from './song-library.service';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { SoundCloudLibrary } from './soundcloud-library.service';

@Component({
  selector: 'app-song-library',
  templateUrl: './song-library.component.html',
  styleUrls: ['./song-library.component.scss'],
})
export class SongLibraryComponent implements OnInit {
  private _subscription$: Subscription = new Subscription();
  public selectedFolderSongs: Song[] = [];
  public selectedFolderType: FolderType | undefined;

  constructor(
    public songLibraryService: SongLibraryService,
    public spotifyLibrary: SpotifyLibrary,
    public youTubeLibrary: YouTubeLibrary,
    public soundCloudLibrary: SoundCloudLibrary,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  public subscribe() {
    this.songLibraryService.selectedFolderSongs$.subscribe((data) => {
      this.selectedFolderSongs = data;
      this.cd.detectChanges();
    });

    this.songLibraryService.selectedFolderType$.subscribe(
      (data) => (this.selectedFolderType = data)
    );

    this.spotifyLibrary.code$
      .pipe(
        filter((code) => code !== undefined),
        take(1),
        switchMap((code) => this.spotifyLibrary.fetchTokens$({ code }))
      )
      .subscribe((data) => {
        const { access_token, refresh_token } = data;
        this.spotifyLibrary.setAccessToken({ accessToken: access_token });
        this.spotifyLibrary.setRefreshToken({ refreshToken: refresh_token });
      });

    this.youTubeLibrary.accessToken$.subscribe((data) => {
      console.log('accessToken', data);
    });

    this.youTubeLibrary.refreshToken$.subscribe((data) => {
      console.log('refreshToken', data);
    });

    this.youTubeLibrary.code$
      .pipe(
        filter((code) => code !== undefined),
        take(1),
        switchMap((code) => this.youTubeLibrary.fetchTokens$({ code }))
      )
      .subscribe((data) => {
        const { access_token, refresh_token } = data;
        this.youTubeLibrary.setAccessToken({ accessToken: access_token });
        // this.youTubeLibrary.setRefreshToken({ refreshToken: refresh_token });
        console.log(data);
      });

    this.spotifyLibrary.accessTokenNeedBeRefreshed$
      .pipe(
        switchMap((refreshToken) =>
          this.spotifyLibrary.fetchRefreshingToken$({ refreshToken })
        )
      )
      .subscribe((data) => {
        const { access_token } = data;
        this.spotifyLibrary.setAccessToken({ accessToken: access_token });
      });

    this.spotifyLibrary.accessToken$
      .pipe(
        filter((accessToken) => accessToken !== undefined),
        filter((accessToken) => Date.now() < accessToken.expirationAt),
        take(1),
        map((accessToken) => accessToken.token),
        switchMap((accessToken) =>
          forkJoin([
            this.spotifyLibrary.fetchUserTracks$({ accessToken, offset: 0 }),
            this.spotifyLibrary.fetchUserTracks$({ accessToken, offset: 50 }),
            this.spotifyLibrary.fetchUserTracks$({ accessToken, offset: 100 }),
          ])
        ),
        map(([res1, res2, res3]) => [...res1, ...res2, ...res3])
      )
      .subscribe((data) => {
        this.spotifyLibrary.setUserTracks(data);
      });

    this.soundCloudLibrary.userId$
      .pipe(
        filter((userId) => userId !== undefined),
        take(1),
        switchMap((userId) =>
          forkJoin([
            this.soundCloudLibrary.fetchUserTracks$({ userId, offset: 0 }),
            this.soundCloudLibrary.fetchUserTracks$({ userId, offset: 50 }),
            this.soundCloudLibrary.fetchUserTracks$({ userId, offset: 100 }),
          ])
        ),
        map(([res1, res2, res3]) => [...res1, ...res2, ...res3])
      )
      .subscribe((data) => {
        console.log(JSON.stringify(data));
        this.soundCloudLibrary.setUserTracks(data);
      });

    this.youTubeLibrary.accessToken$
      .pipe(
        filter((accessToken) => accessToken !== undefined),
        filter((accessToken) => Date.now() < accessToken.expirationAt),
        take(1),
        map((accessToken) => accessToken.token),
        switchMap((accessToken) =>
          this.youTubeLibrary.fetchUserTracks$({ accessToken, offset: 0 })
        )
        //  map(([res1, res2, res3]) => [...res1, ...res2, ...res3])
      )
      .subscribe((data) => {
        this.youTubeLibrary.setUserTracks(data);
      });
  }

  public handleAddSpotifyAccountClick = () => {
    this.spotifyLibrary.login();
  };

  public handleAddYouTubeAccountClick = () => {
    this.youTubeLibrary.login();
  };

  public handleAddSoundCloudAccountClick = () => {
    this.soundCloudLibrary.login();
  };

  public handleFolderClick = (folderType: FolderType) => {
    this.songLibraryService.selectFolder(folderType);
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
