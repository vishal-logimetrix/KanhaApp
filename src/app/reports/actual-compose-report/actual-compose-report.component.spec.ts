import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualComposeReportComponent } from './actual-compose-report.component';

describe('ActualComposeReportComponent', () => {
  let component: ActualComposeReportComponent;
  let fixture: ComponentFixture<ActualComposeReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualComposeReportComponent]
    });
    fixture = TestBed.createComponent(ActualComposeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
