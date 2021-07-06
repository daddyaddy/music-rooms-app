import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundcloudAuthComponent } from './soundcloud-auth.component';

describe('SoundcloudAuthComponent', () => {
  let component: SoundcloudAuthComponent;
  let fixture: ComponentFixture<SoundcloudAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoundcloudAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundcloudAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
