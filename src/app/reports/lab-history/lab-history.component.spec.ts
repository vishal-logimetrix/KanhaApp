import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabHistoryComponent } from './lab-history.component';

describe('LabHistoryComponent', () => {
  let component: LabHistoryComponent;
  let fixture: ComponentFixture<LabHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabHistoryComponent]
    });
    fixture = TestBed.createComponent(LabHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
