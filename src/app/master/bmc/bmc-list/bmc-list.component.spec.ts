import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmcListComponent } from './bmc-list.component';

describe('BmcListComponent', () => {
  let component: BmcListComponent;
  let fixture: ComponentFixture<BmcListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BmcListComponent]
    });
    fixture = TestBed.createComponent(BmcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
