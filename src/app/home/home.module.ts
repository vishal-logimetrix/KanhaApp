import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterModule } from '../master/master.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MPPDashboardComponent } from './dashboard/mppdashboard/mppdashboard.component';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: HomeComponent, children:[
  // { path: '', component: DashboardComponent, children:[
    {path: 'home/dashboard', component: DashboardComponent},
    {path: 'home/Mpp/dashboard', component: MPPDashboardComponent},
    {path: '', loadChildren: ()=> import('src/app/master/master.module').then(m=> m.MasterModule)},
  ]}
];


@NgModule({
  declarations: [
    HomeComponent,
    SideBarComponent,
    DashboardComponent,
    MPPDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    ModalModule.forRoot() ,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule],
  
})
export class HomeModule { 
}
