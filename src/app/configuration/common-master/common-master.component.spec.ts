import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMasterComponent } from './common-master.component';

describe('CommonMasterComponent', () => {
  let component: CommonMasterComponent;
  let fixture: ComponentFixture<CommonMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonMasterComponent]
    });
    fixture = TestBed.createComponent(CommonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
