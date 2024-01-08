import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MppListComponent } from './mpp-list.component';

describe('MppListComponent', () => {
  let component: MppListComponent;
  let fixture: ComponentFixture<MppListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MppListComponent]
    });
    fixture = TestBed.createComponent(MppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
