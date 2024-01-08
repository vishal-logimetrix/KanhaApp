import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockChecklistReportComponent } from './dock-checklist-report.component';

describe('DockChecklistReportComponent', () => {
  let component: DockChecklistReportComponent;
  let fixture: ComponentFixture<DockChecklistReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DockChecklistReportComponent]
    });
    fixture = TestBed.createComponent(DockChecklistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
