import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleWiseChecklistComponent } from './sample-wise-checklist.component';

describe('SampleWiseChecklistComponent', () => {
  let component: SampleWiseChecklistComponent;
  let fixture: ComponentFixture<SampleWiseChecklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleWiseChecklistComponent]
    });
    fixture = TestBed.createComponent(SampleWiseChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
