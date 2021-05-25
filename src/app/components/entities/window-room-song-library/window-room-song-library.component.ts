import { ClientsFacade } from 'src/app/store/clients/clients.facade';
import { ClientsState } from 'src/app/store/clients/clients.state';
import { WindowRoomSongLibraryService } from './window-room-song-library.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomsFacade } from 'src/app/store/rooms/rooms.facade';
import songs from '../../../../assets/songs.json';

@Component({
  selector: 'app-window-room-song-library',
  templateUrl: './window-room-song-library.component.html',
  styleUrls: ['./window-room-song-library.component.scss'],
})
export class WindowRoomSongLibraryComponent implements OnInit {
  private _subscription$: Subscription = new Subscription();
  public songs: Song[] = songs;
  public isWindowOpened: boolean = true;
  public currentClient: Client;
  public selectedRoom: Room;

  constructor(
    private clientFacade: ClientsFacade,
    private windowRoomSongLibraryService: WindowRoomSongLibraryService,
    private roomsFacade: RoomsFacade
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.serve();
      this.subscribe();
    }, 0);
  }

  private serve(): void {}

  private subscribe(): void {
    this._subscription$.add(
      this.clientFacade.currentClient$.subscribe((data) => {
        this.currentClient = data;
      })
    );
    this._subscription$.add(
      this.roomsFacade.selectedRoom$.subscribe((data) => {
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
    if (!currentClient.user) return;
    if (!selectedRoom) return;
    this.roomsFacade.addRoomSong(
      { ...song, addedByClient: currentClient },
      selectedRoom.roomId
    );
    this.windowRoomSongLibraryService.closeWindow();
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
