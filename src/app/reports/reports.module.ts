import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDAComponent } from './cda/cda.component';
import { FarmerMasterComponent } from './farmer-master/farmer-master.component';
import { FarmerShiftReportComponent } from './farmer-shift-report/farmer-shift-report.component';
import { FarmerSummaryReportComponent } from './farmer-summary-report/farmer-summary-report.component';
import { MPPDispatchComponent } from './mppdispatch/mppdispatch.component';
import { FarmerPassbookComponent } from './farmer-passbook/farmer-passbook.component';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ActualComposeReportComponent } from './actual-compose-report/actual-compose-report.component';
import { CollectionVsReceiptComponent } from './collection-vs-receipt/collection-vs-receipt.component';
import { SignatureReportComponent } from './signature-report/signature-report.component';
import { MemberAutoManualCollectionComponent } from './member-auto-manual-collection/member-auto-manual-collection.component';
import { MPPLedgerReportComponent } from './mppledger-report/mppledger-report.component';
import { CollectionSummaryReportComponent } from './collection-summary-report/collection-summary-report.component';
import { DockChecklistReportComponent } from './dock-checklist-report/dock-checklist-report.component';
import { LabChecklistReportComponent } from './lab-checklist-report/lab-checklist-report.component';
import { SampleWiseChecklistComponent } from './sample-wise-checklist/sample-wise-checklist.component';
import { ZeroChecklistReportComponent } from './zero-checklist-report/zero-checklist-report.component';
import { DailyMilkSummaryComponent } from './daily-milk-summary/daily-milk-summary.component';
import { SampleWiseRateComponent } from './sample-wise-rate/sample-wise-rate.component';
import { CanMISReportComponent } from './can-mis-report/can-mis-report.component';
import { CollectionLedgerComponent } from './collection-ledger/collection-ledger.component';
import { FarmerHistoryReportComponent } from './farmer-history-report/farmer-history-report.component';
import { DispatchHistoryComponent } from './dispatch-history/dispatch-history.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { DockHistoryComponent } from './dock-history/dock-history.component';
import { LabHistoryComponent } from './lab-history/lab-history.component';
import { DPUStatusComponent } from './dpu-status/dpu-status.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
{path: 'CDA/report', component: CDAComponent},
{path: 'farmer-master/report', component: FarmerMasterComponent},
{path: 'farmer-shift/report', component: FarmerShiftReportComponent},
{path: 'farmer-summary/report', component: FarmerSummaryReportComponent},
{path: 'mpp-dispatch-summary/report', component: MPPDispatchComponent},
{path: 'farmer-passbook/report', component: FarmerPassbookComponent},
{path: 'actual-compose/report', component: ActualComposeReportComponent},
{path: 'collection-receipt/report', component: CollectionVsReceiptComponent},
{path: 'signature/report', component: SignatureReportComponent},
{path: 'member-auto-manual-collection/report', component: MemberAutoManualCollectionComponent},
{path: 'MPP-ledger/report', component: MPPLedgerReportComponent},
{path: 'collection-summary/report', component: CollectionSummaryReportComponent},
{path: 'dock-checklist/report', component: DockChecklistReportComponent},
{path: 'lab-checklist/report', component: LabChecklistReportComponent},
{path: 'sample-wise-checklist/report', component: SampleWiseChecklistComponent},
{path: 'zeroLr-checklist/report', component: ZeroChecklistReportComponent},
{path: 'daily-milk-summmary/report', component: DailyMilkSummaryComponent},
{path: 'sample-wise-rateList/report', component: SampleWiseRateComponent},
{path: 'canMis/report', component: CanMISReportComponent},
{path: 'collection-ledger/report', component: CollectionLedgerComponent},
{path: 'farmer-history/report', component: FarmerHistoryReportComponent},
{path: 'dispatch-history/report', component: DispatchHistoryComponent},
{path: 'transfer-history/report', component: TransferHistoryComponent},
{path: 'dock-history/report', component: DockHistoryComponent},
{path: 'lab-history/report', component: LabHistoryComponent},
{path: 'dpu-status-history/report', component: DPUStatusComponent},
{path: '', loadChildren: ()=> import('src/app/user-managment/user-managment.module').then(m=>m.UserManagmentModule)}
]


@NgModule({
  declarations: [
    CDAComponent,
    FarmerMasterComponent,
    FarmerShiftReportComponent,
    FarmerSummaryReportComponent,
    MPPDispatchComponent,
    FarmerPassbookComponent,
    ActualComposeReportComponent,
    CollectionVsReceiptComponent,
    SignatureReportComponent,
    MemberAutoManualCollectionComponent,
    MPPLedgerReportComponent,
    CollectionSummaryReportComponent,
    DockChecklistReportComponent,
    LabChecklistReportComponent,
    SampleWiseChecklistComponent,
    ZeroChecklistReportComponent,
    DailyMilkSummaryComponent,
    SampleWiseRateComponent,
    CanMISReportComponent,
    CollectionLedgerComponent,
    FarmerHistoryReportComponent,
    DispatchHistoryComponent,
    TransferHistoryComponent,
    DockHistoryComponent,
    LabHistoryComponent,
    DPUStatusComponent
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
export class ReportsModule { }
