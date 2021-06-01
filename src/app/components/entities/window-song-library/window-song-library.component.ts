import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import songs from '../../../../assets/songs.json';
import { StoreFacade } from 'src/app/core/store/store.facade';
import { WindowSongLibraryService } from './window-song-library.service';

@Component({
  selector: 'app-window-song-library',
  templateUrl: './window-song-library.component.html',
  styleUrls: ['./window-song-library.component.scss'],
})
export class WindowSongLibraryComponent implements OnInit {
  private _subscription$: Subscription = new Subscription();
  public songs: Array<Song> = songs;
  public isWindowOpened: boolean = true;
  public currentClient: Client;
  public selectedRoom: Room;

  constructor(
    private storeFacade: StoreFacade,
    private windowRoomSongLibraryService: WindowSongLibraryService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscribe();
    }, 0);
  }

  private subscribe(): void {
    this._subscription$.add(
      this.storeFacade.currentClient$.subscribe((data) => {
        this.currentClient = data;
      })
    );
    this._subscription$.add(
      this.storeFacade.selectedRoom$.subscribe((data) => {
        this.selectedRoom = data;
      })
    );
    this._subscription$.add(
      this.windowRoomSongLibraryService.isWindowOpened$.subscribe((data) => {
        this.isWindowOpened = data;
      })
    );
  }

  public handleCloseWindow(): void {
    this.windowRoomSongLibraryService.closeWindow();
  }

  public handleSongButtonClick(song: Song): void {
    const { currentClient, selectedRoom } = this;
    if (!currentClient) return;
    if (!selectedRoom) return;
    const { roomId } = selectedRoom;
    const roomSong: RoomSong = { ...song, addedByClient: currentClient };
    this.storeFacade.addRoomSong({ roomSong, roomId });
    this.windowRoomSongLibraryService.closeWindow();
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
