import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSongHostPilotComponent } from './room-song-host-pilot.component';

describe('RoomSongHostPilotComponent', () => {
  let component: RoomSongHostPilotComponent;
  let fixture: ComponentFixture<RoomSongHostPilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSongHostPilotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSongHostPilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
