import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSongMembersComponent } from './room-song-members.component';

describe('RoomSongMembersComponent', () => {
  let component: RoomSongMembersComponent;
  let fixture: ComponentFixture<RoomSongMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSongMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSongMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
