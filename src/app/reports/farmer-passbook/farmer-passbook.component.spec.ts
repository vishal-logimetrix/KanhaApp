import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerPassbookComponent } from './farmer-passbook.component';

describe('FarmerPassbookComponent', () => {
  let component: FarmerPassbookComponent;
  let fixture: ComponentFixture<FarmerPassbookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerPassbookComponent]
    });
    fixture = TestBed.createComponent(FarmerPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
