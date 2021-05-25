import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSongPreviewComponent } from './room-song-preview.component';

describe('RoomSongPreviewComponent', () => {
  let component: RoomSongPreviewComponent;
  let fixture: ComponentFixture<RoomSongPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSongPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSongPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
