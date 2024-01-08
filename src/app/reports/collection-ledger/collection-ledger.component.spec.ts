import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionLedgerComponent } from './collection-ledger.component';

describe('CollectionLedgerComponent', () => {
  let component: CollectionLedgerComponent;
  let fixture: ComponentFixture<CollectionLedgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionLedgerComponent]
    });
    fixture = TestBed.createComponent(CollectionLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
