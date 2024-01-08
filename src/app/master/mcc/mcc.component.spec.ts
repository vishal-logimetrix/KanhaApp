import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCCComponent } from './mcc.component';

describe('MCCComponent', () => {
  let component: MCCComponent;
  let fixture: ComponentFixture<MCCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MCCComponent]
    });
    fixture = TestBed.createComponent(MCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
