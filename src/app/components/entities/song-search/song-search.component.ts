import {
  SongLibraryService,
  FolderType,
} from './../song-library/song-library.service';
import { SpotifyLibrary } from '../song-library/spotify-library.service';
import { StoreFacade } from './../../../core/store/store.facade';
import { YoutubeService } from './../../../core/youtube/youtube.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss'],
})
export class SongSearchComponent implements OnInit {
  @ViewChild('searchInputRef') searchInputRef;
  @ViewChild('searchButtonRef') searchButtonRef;
  @ViewChild('cancelButtonRef') cancelButtonRef;
  private _subscription$: Subscription = new Subscription();
  public searchInputKeyUp$: Observable<KeyboardEvent>;
  public searchInputFocus$: Observable<FocusEvent>;
  public searchInputEnter$: Observable<KeyboardEvent>;
  public searchInputValue$: Observable<string>;
  public searchButtonClick$: Observable<MouseEvent>;
  public cancelButtonClick$: Observable<MouseEvent>;
  public searchSubmit$: Observable<any>;
  public selectedRoomSongs: RoomSong[] = [];
  public isSearchPending: boolean = false;
  public isAddSongPending: boolean = false;
  public selectedSongId: string;
  public songProgress: SongProgress | undefined;
  public circumference = 2 * Math.PI * 20;
  public dashoffset: number | undefined;
  public searchInputValue: string = '';
  public ytItems: Array<YtItem> = [];
  public currentClient: Client;
  public selectedRoom: Room;
  public selectedFolder: FolderType;

  constructor(
    public youtubeService: YoutubeService,
    public storeFacade: StoreFacade,
    public songLibraryService: SongLibraryService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.serve();
      this.subscribe();
    }, 0);
  }

  public serve() {
    const { searchInputRef, searchButtonRef, cancelButtonRef } = this;
    this.searchInputKeyUp$ = fromEvent(searchInputRef.nativeElement, 'keyup');
    this.searchInputFocus$ = fromEvent(searchInputRef.nativeElement, 'focus');
    this.searchButtonClick$ = fromEvent(searchButtonRef.nativeElement, 'click');
    this.cancelButtonClick$ = fromEvent(cancelButtonRef.nativeElement, 'click');
    this.searchInputEnter$ = this.searchInputKeyUp$.pipe(
      filter((event) => event.key === 'Enter')
    );
    this.searchInputValue$ = this.searchInputKeyUp$.pipe(
      map((event) => event.target),
      map((input: HTMLInputElement) => input.value)
    );

    this.searchSubmit$ = merge(
      this.searchButtonClick$,
      this.searchInputEnter$
    ).pipe(
      withLatestFrom(this.searchInputValue$),
      filter(([, searchInputValue]) => searchInputValue.length >= 3)
    );
  }

  public subscribe() {
    const { youtubeService } = this;
    this.storeFacade.selectedRoomSongs$.subscribe(
      (data) => (this.selectedRoomSongs = data)
    );
    youtubeService.isSearchPending$.subscribe(
      (data) => (this.isSearchPending = data)
    );
    youtubeService.isAddSongPending$.subscribe(
      (data) => (this.isAddSongPending = data)
    );

    youtubeService.isAddSongPending$
      .pipe(
        distinctUntilChanged(),
        filter((isPending) => !isPending)
      )
      .subscribe((data) => {
        this.ytItems = [];
        this.songProgress = undefined;
        this.selectedSongId = undefined;
        this.searchInputValue = '';
      });
    this.searchInputValue$.subscribe((data) => (this.searchInputValue = data));
    this.searchInputFocus$.subscribe((data) => {
      this.ytItems = [];
      this.songLibraryService.selectFolder(undefined);
    });
    this.songLibraryService.selectedFolderType$
      .pipe(filter((folderType) => folderType !== undefined))
      .subscribe((data) => {
        this.ytItems = [];
      });
    this.searchSubmit$.subscribe((data) => {
      this.searchInputRef.nativeElement.blur();
      this.songLibraryService.selectFolder(undefined);
    });
    this.cancelButtonClick$.subscribe((data) => {
      this.ytItems = [];
      this.searchInputValue = '';
    });
    this.searchSubmit$
      .pipe(switchMap(([, value]) => youtubeService.fetchItemsBy(value)))
      .subscribe(
        (items) =>
          (this.ytItems = items.map((item) => ({
            ...item,
            snippet: {
              ...item.snippet,
              title: item.snippet.title.replaceAll('&quot;', ''),
            },
          })))
      );

    this.storeFacade.currentClient$.subscribe(
      (data) => (this.currentClient = data)
    );

    this.storeFacade.selectedRoom$.subscribe(
      (data) => (this.selectedRoom = data)
    );

    this.youtubeService.songProgress$.subscribe((data) => {
      this.songProgress = data;
      if (!this.songProgress) this.dashoffset = undefined;
      else {
        const progress = this.songProgress.progress / 100;
        this.dashoffset = this.circumference * (1 - progress);
      }
    });

    this.songLibraryService.selectedFolderType$.subscribe((data) => {
      this.selectedFolder = data;
    });
  }

  public handleYtItemClick = (item: YtItem | undefined) => {
    const { currentClient, selectedRoom } = this;
    const { id, snippet } = item;
    if (!item) return;
    if (!currentClient) return;
    if (!selectedRoom) return;
    this.selectedSongId = item.id.videoId;
    this.storeFacade.addRoomSong({
      roomId: selectedRoom.roomId,
      roomSong: {
        songId: id.videoId,
        ytId: id.videoId,
        author: snippet.channelTitle,
        title: snippet.title,
        cover: snippet.thumbnails.default.url,
        addedByClient: currentClient,
      },
    });
  };

  public getItems = (
    ytItems: Array<YtItem | undefined>,
    isSearchPending: boolean
  ): Array<YtItem | undefined> => {
    if (isSearchPending) return [undefined, undefined];
    return ytItems;
  };

  public isSongAlreadyAdded = (ytId: string) => {
    const { selectedRoomSongs } = this;
    return Boolean(selectedRoomSongs.find((song) => song.ytId === ytId));
  };

  public handleFoldersButtonClick = () => {
    const { selectedFolder } = this;

    selectedFolder
      ? this.songLibraryService.selectFolder(undefined)
      : this.songLibraryService.selectFolder('spotify');
  };

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
