import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMasterComponent } from './device-master.component';

describe('DeviceMasterComponent', () => {
  let component: DeviceMasterComponent;
  let fixture: ComponentFixture<DeviceMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceMasterComponent]
    });
    fixture = TestBed.createComponent(DeviceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
