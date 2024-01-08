import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPPDispatchComponent } from './mppdispatch.component';

describe('MPPDispatchComponent', () => {
  let component: MPPDispatchComponent;
  let fixture: ComponentFixture<MPPDispatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MPPDispatchComponent]
    });
    fixture = TestBed.createComponent(MPPDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
