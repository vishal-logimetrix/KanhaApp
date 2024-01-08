import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDAComponent } from './cda.component';

describe('CDAComponent', () => {
  let component: CDAComponent;
  let fixture: ComponentFixture<CDAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CDAComponent]
    });
    fixture = TestBed.createComponent(CDAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
