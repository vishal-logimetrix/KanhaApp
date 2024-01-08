import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-button-renderer-component',
  template: `
  <a (click)="onClick($event)"  data-toggle="tooltip" title="{{this.tooltip}}"><i [class]='icon' style="font-size: larger;"> </i></a>
  `
})
export class GridButtonRendererComponentComponent implements  ICellRendererAngularComp {

  public params : any;
  public label: any;
  public tooltip:any;
  public icon:any;

 agInit(params : any): void {
    this.params = params;
    this.label = this.params.label || null;
    this.tooltip=this.params.tooltip || null;
    this.icon=this.params.icon;
  }
  constructor() { }

  ngOnInit(): void {
  }

   refresh(params?: any): boolean {
    return true;
  }

  onClick($event : any) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
  

}
