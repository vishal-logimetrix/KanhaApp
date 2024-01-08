import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MppDispatchListComponent } from './mpp-dispatch-list.component';

describe('MppDispatchListComponent', () => {
  let component: MppDispatchListComponent;
  let fixture: ComponentFixture<MppDispatchListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MppDispatchListComponent]
    });
    fixture = TestBed.createComponent(MppDispatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
