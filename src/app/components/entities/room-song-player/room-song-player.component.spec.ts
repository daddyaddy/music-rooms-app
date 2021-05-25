import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSongPlayerComponent } from './room-song-player.component';

describe('RoomSongPlayerComponent', () => {
  let component: RoomSongPlayerComponent;
  let fixture: ComponentFixture<RoomSongPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSongPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSongPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
