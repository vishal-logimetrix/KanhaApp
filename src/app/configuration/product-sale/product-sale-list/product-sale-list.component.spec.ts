import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaleListComponent } from './product-sale-list.component';

describe('ProductSaleListComponent', () => {
  let component: ProductSaleListComponent;
  let fixture: ComponentFixture<ProductSaleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSaleListComponent]
    });
    fixture = TestBed.createComponent(ProductSaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
