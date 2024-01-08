import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPPComponent } from './mpp.component';

describe('MPPComponent', () => {
  let component: MPPComponent;
  let fixture: ComponentFixture<MPPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MPPComponent]
    });
    fixture = TestBed.createComponent(MPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
