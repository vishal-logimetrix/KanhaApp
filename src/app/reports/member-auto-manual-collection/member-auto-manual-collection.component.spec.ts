import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAutoManualCollectionComponent } from './member-auto-manual-collection.component';

describe('MemberAutoManualCollectionComponent', () => {
  let component: MemberAutoManualCollectionComponent;
  let fixture: ComponentFixture<MemberAutoManualCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberAutoManualCollectionComponent]
    });
    fixture = TestBed.createComponent(MemberAutoManualCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
