import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SahayakComponent } from './sahayak.component';

describe('SahayakComponent', () => {
  let component: SahayakComponent;
  let fixture: ComponentFixture<SahayakComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SahayakComponent]
    });
    fixture = TestBed.createComponent(SahayakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
