import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridButtonRendererComponentComponent } from './grid-button-renderer-component.component';

describe('GridButtonRendererComponentComponent', () => {
  let component: GridButtonRendererComponentComponent;
  let fixture: ComponentFixture<GridButtonRendererComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridButtonRendererComponentComponent]
    });
    fixture = TestBed.createComponent(GridButtonRendererComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
