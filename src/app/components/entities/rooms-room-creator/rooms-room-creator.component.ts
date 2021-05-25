import { WindowRoomCreatorService } from './../window-room-creator/window-room-creator.service';
import { RoomsFacade } from './../../../store/rooms/rooms.facade';
import { fromEvent, Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-rooms-room-creator',
  templateUrl: './rooms-room-creator.component.html',
  styleUrls: ['./rooms-room-creator.component.scss'],
})
export class RoomsRoomCreatorComponent implements OnInit {
  @ViewChild('createRoomButtonRef') createRoomButtonRef;
  private createRoomButtonClick$: Observable<MouseEvent>;

  constructor(private windowRoomCreatorService: WindowRoomCreatorService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.serve();
    this.subscribe();
  }

  private serve(): void {
    this.createRoomButtonClick$ = fromEvent(
      this.createRoomButtonRef.nativeElement,
      'click'
    );
  }

  private subscribe(): void {
    this.createRoomButtonClick$.subscribe((data) => {
      this.windowRoomCreatorService.openWindow();
    });
  }
}
