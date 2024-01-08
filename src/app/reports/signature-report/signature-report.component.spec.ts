import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureReportComponent } from './signature-report.component';

describe('SignatureReportComponent', () => {
  let component: SignatureReportComponent;
  let fixture: ComponentFixture<SignatureReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignatureReportComponent]
    });
    fixture = TestBed.createComponent(SignatureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
