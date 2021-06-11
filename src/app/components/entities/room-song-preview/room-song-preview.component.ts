import { StoreFacade } from 'src/app/core/store/store.facade';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-song-preview',
  templateUrl: './room-song-preview.component.html',
  styleUrls: ['./room-song-preview.component.scss'],
})
export class RoomSongPreviewComponent implements OnInit {
  @Input() roomId: string;
  @Input() isHost: boolean;
  @Input() roomSong: RoomSong;
  @Input() isCurrent: boolean;

  constructor(public storeFacade: StoreFacade) {}

  ngOnInit(): void {}

  public handleRoomSongPreviewClick = () => {
    const { roomId, isHost, roomSong } = this;
    if (!isHost) return;
    this.storeFacade.selectRoomSong({ roomId, songId: roomSong.songId });
  };
}
