import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerHistoryReportComponent } from './farmer-history-report.component';

describe('FarmerHistoryReportComponent', () => {
  let component: FarmerHistoryReportComponent;
  let fixture: ComponentFixture<FarmerHistoryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerHistoryReportComponent]
    });
    fixture = TestBed.createComponent(FarmerHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
