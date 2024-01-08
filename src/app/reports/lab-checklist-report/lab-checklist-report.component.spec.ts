import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabChecklistReportComponent } from './lab-checklist-report.component';

describe('LabChecklistReportComponent', () => {
  let component: LabChecklistReportComponent;
  let fixture: ComponentFixture<LabChecklistReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabChecklistReportComponent]
    });
    fixture = TestBed.createComponent(LabChecklistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
