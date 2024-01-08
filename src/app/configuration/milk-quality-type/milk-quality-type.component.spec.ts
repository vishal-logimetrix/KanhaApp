import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkQualityTypeComponent } from './milk-quality-type.component';

describe('MilkQualityTypeComponent', () => {
  let component: MilkQualityTypeComponent;
  let fixture: ComponentFixture<MilkQualityTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilkQualityTypeComponent]
    });
    fixture = TestBed.createComponent(MilkQualityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
