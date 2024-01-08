import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPPDashboardComponent } from './mppdashboard.component';

describe('MPPDashboardComponent', () => {
  let component: MPPDashboardComponent;
  let fixture: ComponentFixture<MPPDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MPPDashboardComponent]
    });
    fixture = TestBed.createComponent(MPPDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
