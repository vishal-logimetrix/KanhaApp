import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanMISReportComponent } from './can-mis-report.component';

describe('CanMISReportComponent', () => {
  let component: CanMISReportComponent;
  let fixture: ComponentFixture<CanMISReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CanMISReportComponent]
    });
    fixture = TestBed.createComponent(CanMISReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
