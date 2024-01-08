import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateApplicabilityListComponent } from './rate-applicability-list.component';

describe('RateApplicabilityListComponent', () => {
  let component: RateApplicabilityListComponent;
  let fixture: ComponentFixture<RateApplicabilityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateApplicabilityListComponent]
    });
    fixture = TestBed.createComponent(RateApplicabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
