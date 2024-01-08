import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerCollectionComponent } from './farmer-collection.component';

describe('FarmerCollectionComponent', () => {
  let component: FarmerCollectionComponent;
  let fixture: ComponentFixture<FarmerCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerCollectionComponent]
    });
    fixture = TestBed.createComponent(FarmerCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
