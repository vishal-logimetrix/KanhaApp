import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TehsilComponent } from './tehsil.component';

describe('TehsilComponent', () => {
  let component: TehsilComponent;
  let fixture: ComponentFixture<TehsilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TehsilComponent]
    });
    fixture = TestBed.createComponent(TehsilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
