import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerSummaryReportComponent } from './farmer-summary-report.component';

describe('FarmerSummaryReportComponent', () => {
  let component: FarmerSummaryReportComponent;
  let fixture: ComponentFixture<FarmerSummaryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerSummaryReportComponent]
    });
    fixture = TestBed.createComponent(FarmerSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
