import { StoreFacade } from './../../../core/store/store.facade';
import { Component, Input, OnInit } from '@angular/core';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-room-preview',
  templateUrl: './room-preview.component.html',
  styleUrls: ['./room-preview.component.scss'],
})
export class RoomPreviewComponent implements OnInit {
  @Input() roomDetail: RoomDetail;
  constructor(private storeFacade: StoreFacade) {}

  ngOnInit(): void {}

  handleJoinButtonClick = (roomId: string) => {
    this.storeFacade.joinRoom(roomId);
  };
}
