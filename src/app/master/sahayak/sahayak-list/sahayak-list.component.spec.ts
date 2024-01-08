import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SahayakListComponent } from './sahayak-list.component';

describe('SahayakListComponent', () => {
  let component: SahayakListComponent;
  let fixture: ComponentFixture<SahayakListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SahayakListComponent]
    });
    fixture = TestBed.createComponent(SahayakListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
