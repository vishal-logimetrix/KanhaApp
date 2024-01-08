import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMCCollectionComponent } from './bmccollection.component';

describe('BMCCollectionComponent', () => {
  let component: BMCCollectionComponent;
  let fixture: ComponentFixture<BMCCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BMCCollectionComponent]
    });
    fixture = TestBed.createComponent(BMCCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
