import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleWiseRateComponent } from './sample-wise-rate.component';

describe('SampleWiseRateComponent', () => {
  let component: SampleWiseRateComponent;
  let fixture: ComponentFixture<SampleWiseRateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleWiseRateComponent]
    });
    fixture = TestBed.createComponent(SampleWiseRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
