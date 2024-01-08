import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaleComponent } from './product-sale.component';

describe('ProductSaleComponent', () => {
  let component: ProductSaleComponent;
  let fixture: ComponentFixture<ProductSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSaleComponent]
    });
    fixture = TestBed.createComponent(ProductSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
