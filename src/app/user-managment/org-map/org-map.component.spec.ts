import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgMapComponent } from './org-map.component';

describe('OrgMapComponent', () => {
  let component: OrgMapComponent;
  let fixture: ComponentFixture<OrgMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgMapComponent]
    });
    fixture = TestBed.createComponent(OrgMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
