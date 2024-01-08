import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSummaryReportComponent } from './collection-summary-report.component';

describe('CollectionSummaryReportComponent', () => {
  let component: CollectionSummaryReportComponent;
  let fixture: ComponentFixture<CollectionSummaryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionSummaryReportComponent]
    });
    fixture = TestBed.createComponent(CollectionSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
