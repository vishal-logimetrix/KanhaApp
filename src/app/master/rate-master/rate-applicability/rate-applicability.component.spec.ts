import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateApplicabilityComponent } from './rate-applicability.component';

describe('RateApplicabilityComponent', () => {
  let component: RateApplicabilityComponent;
  let fixture: ComponentFixture<RateApplicabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateApplicabilityComponent]
    });
    fixture = TestBed.createComponent(RateApplicabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
