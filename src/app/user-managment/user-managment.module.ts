import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UserMasterComponent } from './user-master/user-master.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserListComponent } from './user-master/user-list/user-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OrgMapComponent } from './org-map/org-map.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

const routes: Routes = [
  {path:'user', component: UserMasterComponent},
  {path:'user/list', component: UserListComponent},
  {path:'change/password', component: ChangePasswordComponent},
  {path:'org/map', component: OrgMapComponent},
];
@NgModule({
  declarations: [
    UserMasterComponent,
    ChangePasswordComponent,
    UserListComponent,
    OrgMapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    ModalModule.forRoot() ,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
    AngularDualListBoxModule,
  ],
  exports:[RouterModule]

})
export class UserManagmentModule { }
