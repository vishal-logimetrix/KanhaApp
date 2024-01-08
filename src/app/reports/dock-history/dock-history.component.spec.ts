import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockHistoryComponent } from './dock-history.component';

describe('DockHistoryComponent', () => {
  let component: DockHistoryComponent;
  let fixture: ComponentFixture<DockHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DockHistoryComponent]
    });
    fixture = TestBed.createComponent(DockHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
