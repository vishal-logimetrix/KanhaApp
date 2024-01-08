import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiviceMasterListComponent } from './divice-master-list.component';

describe('DiviceMasterListComponent', () => {
  let component: DiviceMasterListComponent;
  let fixture: ComponentFixture<DiviceMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiviceMasterListComponent]
    });
    fixture = TestBed.createComponent(DiviceMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
