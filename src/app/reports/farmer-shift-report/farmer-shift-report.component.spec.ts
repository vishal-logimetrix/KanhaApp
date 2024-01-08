import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerShiftReportComponent } from './farmer-shift-report.component';

describe('FarmerShiftReportComponent', () => {
  let component: FarmerShiftReportComponent;
  let fixture: ComponentFixture<FarmerShiftReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerShiftReportComponent]
    });
    fixture = TestBed.createComponent(FarmerShiftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
