import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowRoomSongLibraryComponent } from './window-room-song-library.component';

describe('WindowRoomSongLibraryComponent', () => {
  let component: WindowRoomSongLibraryComponent;
  let fixture: ComponentFixture<WindowRoomSongLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowRoomSongLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowRoomSongLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
