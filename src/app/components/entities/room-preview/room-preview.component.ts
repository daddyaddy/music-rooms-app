import { ClientsFacade } from 'src/app/store/clients/clients.facade';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RoomDetail } from 'src/utils';

@Component({
  selector: 'app-room-preview',
  templateUrl: './room-preview.component.html',
  styleUrls: ['./room-preview.component.scss'],
})
export class RoomPreviewComponent implements OnInit {
  @Input() roomDetail: RoomDetail;
  constructor(private clientsFacade: ClientsFacade) {}

  ngOnInit(): void {}

  handleJoinButtonClick = (roomId: string) => {
    this.clientsFacade.joinRoom(roomId);
  };
}
