import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { StateComponent } from './state/state.component';
import { AgGridModule } from 'ag-grid-angular';
import { DistrictComponent } from './district/district.component';
import { TehsilComponent } from './tehsil/tehsil.component';
import { VillageComponent } from './village/village.component';
import { CompanyComponent } from './company/company.component';
import { PlantComponent } from './plant/plant.component';
import { MCCComponent } from './mcc/mcc.component';
import { BMCComponent } from './bmc/bmc.component';
import { RouteComponent } from './route/route.component';
import { MPPComponent } from './mpp/mpp.component';
import { SahayakComponent } from './sahayak/sahayak.component';
import { FarmerComponent } from './farmer/farmer.component';
import { RateMasterComponent } from './rate-master/rate-master.component';
import { RateApplicabilityComponent } from './rate-master/rate-applicability/rate-applicability.component';
import { MilkCollectionModule } from 'src/app/milk-collection/milk-collection.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MccListComponent } from './mcc/mcc-list/mcc-list.component';
import { BmcListComponent } from './bmc/bmc-list/bmc-list.component';
import { RouteListComponent } from './route/route-list/route-list.component';
import { MppListComponent } from './mpp/mpp-list/mpp-list.component';
import { SahayakListComponent } from './sahayak/sahayak-list/sahayak-list.component';
import { FarmerListComponent } from './farmer/farmer-list/farmer-list.component';
import { RateApplicabilityListComponent } from './rate-master/rate-applicability-list/rate-applicability-list.component';
import { RateMasterListComponent } from './rate-master/rate-master-list/rate-master-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';

const routes: Routes = [
 {path: 'geo/state', component: StateComponent, children:[
  
 ]},
 {path: 'geo/district', component: DistrictComponent},
 {path: 'geo/tehsil', component: TehsilComponent},
 {path: 'geo/village', component: VillageComponent},
 {path: 'entity/company', component: CompanyComponent},
 {path: 'entity/plant', component: PlantComponent},
 {path: 'entity/mcc', component: MCCComponent},
 {path: 'entity/mcc/list', component: MccListComponent},
 {path: 'entity/bmc', component: BMCComponent},
 {path: 'entity/bmc/list', component: BmcListComponent},
 {path: 'entity/route', component: RouteComponent},
 {path: 'entity/route/route-list', component: RouteListComponent},
 {path: 'entity/mpp', component: MPPComponent},
 {path: 'entity/mpp/mpp-list', component: MppListComponent},
 {path: 'entity/sahayak', component: SahayakComponent},
 {path: 'entity/sahayak/sahayak-list', component: SahayakListComponent},
 {path: 'entity/farmer', component: FarmerComponent},
 {path: 'entity/farmer/farmer-list', component: FarmerListComponent},
 {path: 'milk/rate-master', component: RateMasterComponent},
 {path: 'milk/rate-master/list', component: RateMasterListComponent},
 {path: 'milk/rate-applicability', component: RateApplicabilityComponent},
 {path: 'milk/rate-applicability/list', component: RateApplicabilityListComponent},
 {path: '', loadChildren: ()=> import('src/app/milk-collection/milk-collection.module').then(m=>m.MilkCollectionModule)}
]


@NgModule({
  declarations: [
    StateComponent,
    DistrictComponent,
    TehsilComponent,
    VillageComponent,
    CompanyComponent,
    PlantComponent,
    MCCComponent,
    BMCComponent,
    RouteComponent,
    MPPComponent,
    SahayakComponent,
    FarmerComponent,
    RateMasterComponent,
    RateApplicabilityComponent,
    MccListComponent,
    BmcListComponent,
    RouteListComponent,
    MppListComponent,
    SahayakListComponent,
    FarmerListComponent,
    RateApplicabilityListComponent,
    RateMasterListComponent,
    
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
    MatTableModule,
    MatPaginatorModule,
    CdkTableModule,
    CdkTreeModule,
    ModalModule.forRoot() ,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class MasterModule { }
