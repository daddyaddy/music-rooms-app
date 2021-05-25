import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsRoomCreatorComponent } from './rooms-room-creator.component';

describe('RoomsRoomCreatorComponent', () => {
  let component: RoomsRoomCreatorComponent;
  let fixture: ComponentFixture<RoomsRoomCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomsRoomCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsRoomCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
