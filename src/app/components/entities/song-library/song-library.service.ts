import { SoundCloudLibrary } from './soundcloud-library.service';
import { map, switchMap } from 'rxjs/operators';
import { SpotifyLibrary } from './spotify-library.service';
import { YouTubeLibrary } from './youtube-library.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export type FolderType = 'spotify' | 'youtube' | 'soundcloud';

@Injectable({ providedIn: 'root' })
export class SongLibraryService {
  private readonly _selectedFolderType: BehaviorSubject<FolderType | undefined>;
  public readonly selectedFolderType$: Observable<FolderType | undefined>;
  public readonly selectedFolderSongs$: Observable<Song[] | undefined>;

  constructor(
    private spotifyLibrary: SpotifyLibrary,
    private youTubeLibrary: YouTubeLibrary,
    private soundCloudLibrary: SoundCloudLibrary
  ) {
    const library = {
      spotify: spotifyLibrary,
      youtube: youTubeLibrary,
      soundcloud: soundCloudLibrary,
    };
    this._selectedFolderType = new BehaviorSubject(undefined);
    this.selectedFolderType$ = this._selectedFolderType.asObservable();
    this.selectedFolderSongs$ = this.selectedFolderType$.pipe(
      switchMap((selectedFolderType) => library[selectedFolderType].userSongs$)
    );
  }

  public selectFolder(folderType: FolderType | undefined) {
    this._selectedFolderType.next(folderType);
  }

  private subscribe() {}
}
