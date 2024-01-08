import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionVsReceiptComponent } from './collection-vs-receipt.component';

describe('CollectionVsReceiptComponent', () => {
  let component: CollectionVsReceiptComponent;
  let fixture: ComponentFixture<CollectionVsReceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionVsReceiptComponent]
    });
    fixture = TestBed.createComponent(CollectionVsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
