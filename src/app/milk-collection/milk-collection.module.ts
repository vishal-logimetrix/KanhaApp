import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmerCollectionComponent } from './farmer-collection/farmer-collection.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BMCCollectionComponent } from './bmccollection/bmccollection.component';
import { MPPDispatchComponent } from './mppdispatch/mppdispatch.component';
import { FarmerCollectionListComponent } from './farmer-collection/farmer-collection-list/farmer-collection-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgGridModule } from 'ag-grid-angular';
import { BmcCollectionListComponent } from './bmccollection/bmc-collection-list/bmc-collection-list.component';
import { MppDispatchListComponent } from './mppdispatch/mpp-dispatch-list/mpp-dispatch-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';


const routes: Routes = [
{path: 'farmer/collection', component: FarmerCollectionComponent},
{path: 'farmer/collection/list', component: FarmerCollectionListComponent},
{path: 'bmc/collection', component: BMCCollectionComponent},
{path: 'bmc/collection/list', component: BmcCollectionListComponent},
{path: 'Mpp/Dispatch/collection', component: MPPDispatchComponent},
{path: 'Mpp/Dispatch/collection/list', component: MppDispatchListComponent},
{path: '', loadChildren: ()=> import('src/app/configuration/configuration.module').then(m=>m.ConfigurationModule)}
]

@NgModule({
  declarations: [
    FarmerCollectionComponent,
    BMCCollectionComponent,
    MPPDispatchComponent,
    FarmerCollectionListComponent,
    BmcCollectionListComponent,
    MppDispatchListComponent
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
export class MilkCollectionModule { }
