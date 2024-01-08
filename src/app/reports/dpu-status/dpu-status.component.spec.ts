import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPUStatusComponent } from './dpu-status.component';

describe('DPUStatusComponent', () => {
  let component: DPUStatusComponent;
  let fixture: ComponentFixture<DPUStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DPUStatusComponent]
    });
    fixture = TestBed.createComponent(DPUStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
