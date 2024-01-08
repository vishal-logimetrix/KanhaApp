import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUtilityComponent } from './import-utility.component';

describe('ImportUtilityComponent', () => {
  let component: ImportUtilityComponent;
  let fixture: ComponentFixture<ImportUtilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUtilityComponent]
    });
    fixture = TestBed.createComponent(ImportUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
