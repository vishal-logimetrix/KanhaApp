import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmcCollectionListComponent } from './bmc-collection-list.component';

describe('BmcCollectionListComponent', () => {
  let component: BmcCollectionListComponent;
  let fixture: ComponentFixture<BmcCollectionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BmcCollectionListComponent]
    });
    fixture = TestBed.createComponent(BmcCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
