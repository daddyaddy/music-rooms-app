import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSongInputComponent } from './room-song-input.component';

describe('RoomSongInputComponent', () => {
  let component: RoomSongInputComponent;
  let fixture: ComponentFixture<RoomSongInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSongInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSongInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
