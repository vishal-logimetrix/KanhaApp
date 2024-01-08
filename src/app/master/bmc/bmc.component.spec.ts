import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMCComponent } from './bmc.component';

describe('BMCComponent', () => {
  let component: BMCComponent;
  let fixture: ComponentFixture<BMCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BMCComponent]
    });
    fixture = TestBed.createComponent(BMCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
