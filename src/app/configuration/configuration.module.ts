import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MilkTypeComponent } from './milk-type/milk-type.component';
import { MilkQualityTypeComponent } from './milk-quality-type/milk-quality-type.component';
import { CommonMasterComponent } from './common-master/common-master.component';
import { DeviceMasterComponent } from './device-master/device-master.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { ProductSaleComponent } from './product-sale/product-sale.component';
import { ImportUtilityComponent } from './import-utility/import-utility.component';
// import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DiviceMasterListComponent } from './device-master/divice-master-list/divice-master-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { ProductMasterListComponent } from './product-master/product-master-list/product-master-list.component';
import { ProductSaleListComponent } from './product-sale/product-sale-list/product-sale-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

const routes: Routes = [
  {path: 'milk/type', component: MilkTypeComponent},
  {path: 'milk/quality/type', component: MilkQualityTypeComponent},
  {path: 'common/master', component: CommonMasterComponent},
  {path: 'device/master', component: DeviceMasterComponent},
  {path: 'device/master-list', component: DiviceMasterListComponent},
  {path: 'product/master', component: ProductMasterComponent},
  {path: 'product/master/list', component: ProductMasterListComponent},
  {path: 'product/sale', component: ProductSaleComponent},
  {path: 'product/sale/list', component: ProductSaleListComponent},
  {path: 'import/utility', component: ImportUtilityComponent},
  {path: '', loadChildren: ()=> import('src/app/reports/reports.module').then(m=>m.ReportsModule)}
]

@NgModule({
  declarations: [
    MilkTypeComponent,
    MilkQualityTypeComponent,
    CommonMasterComponent,
    DeviceMasterComponent,
    ProductMasterComponent,
    ProductSaleComponent,
    ImportUtilityComponent,
    DiviceMasterListComponent,
    ProductMasterListComponent,
    ProductSaleListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    ModalModule.forRoot() ,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class ConfigurationModule { }
