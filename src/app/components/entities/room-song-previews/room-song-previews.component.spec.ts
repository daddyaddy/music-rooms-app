import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSongPreviewsComponent } from './room-song-previews.component';

describe('RoomSongPreviewsComponent', () => {
  let component: RoomSongPreviewsComponent;
  let fixture: ComponentFixture<RoomSongPreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSongPreviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSongPreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
