import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowRoomCreatorComponent } from './window-room-creator.component';

describe('WindowRoomCreatorComponent', () => {
  let component: WindowRoomCreatorComponent;
  let fixture: ComponentFixture<WindowRoomCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowRoomCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowRoomCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
