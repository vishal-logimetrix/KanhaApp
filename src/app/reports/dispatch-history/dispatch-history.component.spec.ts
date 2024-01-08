import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchHistoryComponent } from './dispatch-history.component';

describe('DispatchHistoryComponent', () => {
  let component: DispatchHistoryComponent;
  let fixture: ComponentFixture<DispatchHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchHistoryComponent]
    });
    fixture = TestBed.createComponent(DispatchHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
