import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerMasterComponent } from './farmer-master.component';

describe('FarmerMasterComponent', () => {
  let component: FarmerMasterComponent;
  let fixture: ComponentFixture<FarmerMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerMasterComponent]
    });
    fixture = TestBed.createComponent(FarmerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
