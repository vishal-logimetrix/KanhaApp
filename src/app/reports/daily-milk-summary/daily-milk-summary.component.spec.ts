import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMilkSummaryComponent } from './daily-milk-summary.component';

describe('DailyMilkSummaryComponent', () => {
  let component: DailyMilkSummaryComponent;
  let fixture: ComponentFixture<DailyMilkSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyMilkSummaryComponent]
    });
    fixture = TestBed.createComponent(DailyMilkSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
