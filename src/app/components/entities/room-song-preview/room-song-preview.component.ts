import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-song-preview',
  templateUrl: './room-song-preview.component.html',
  styleUrls: ['./room-song-preview.component.scss'],
})
export class RoomSongPreviewComponent implements OnInit {
  @Input() roomSong: RoomSong;
  @Input() isCurrent: boolean;

  constructor() {}

  ngOnInit(): void {}
}
