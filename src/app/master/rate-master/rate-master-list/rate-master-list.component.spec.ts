import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMasterListComponent } from './rate-master-list.component';

describe('RateMasterListComponent', () => {
  let component: RateMasterListComponent;
  let fixture: ComponentFixture<RateMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateMasterListComponent]
    });
    fixture = TestBed.createComponent(RateMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
