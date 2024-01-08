import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPPLedgerReportComponent } from './mppledger-report.component';

describe('MPPLedgerReportComponent', () => {
  let component: MPPLedgerReportComponent;
  let fixture: ComponentFixture<MPPLedgerReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MPPLedgerReportComponent]
    });
    fixture = TestBed.createComponent(MPPLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
