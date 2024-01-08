import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterListComponent } from './product-master-list.component';

describe('ProductMasterListComponent', () => {
  let component: ProductMasterListComponent;
  let fixture: ComponentFixture<ProductMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductMasterListComponent]
    });
    fixture = TestBed.createComponent(ProductMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
