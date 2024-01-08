import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MccListComponent } from './mcc-list.component';

describe('MccListComponent', () => {
  let component: MccListComponent;
  let fixture: ComponentFixture<MccListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MccListComponent]
    });
    fixture = TestBed.createComponent(MccListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
