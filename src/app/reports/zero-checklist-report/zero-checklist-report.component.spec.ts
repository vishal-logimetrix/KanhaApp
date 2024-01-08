import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroChecklistReportComponent } from './zero-checklist-report.component';

describe('ZeroChecklistReportComponent', () => {
  let component: ZeroChecklistReportComponent;
  let fixture: ComponentFixture<ZeroChecklistReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZeroChecklistReportComponent]
    });
    fixture = TestBed.createComponent(ZeroChecklistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
