import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Auth/login/login.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import the ModalModule from ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { NewRegisterComponent } from './Auth/new-register/new-register.component';
import { HomeModule } from './home/home.module';
import { MasterModule } from './master/master.module';
import { MilkCollectionModule } from './milk-collection/milk-collection.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ReportsModule } from './reports/reports.module';
import { UserManagmentModule } from './user-managment/user-managment.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageUnderscoreToCamelcasePipe } from './Auth/common/Pipes/message-underscore-to-camelcase.pipe';
import { MessageTranslationPipe } from './Auth/common/Pipes/message-translation.pipe';
import { GridButtonRendererComponentComponent } from './Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { CommonModule, DatePipe } from '@angular/common';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { guardsGuard } from './Auth/common/Guards/guards.guard';
import { JwtInterceptorInterceptor } from './Auth/common/Interceptor/jwt-interceptor.interceptor';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NewRegisterComponent,
    MessageUnderscoreToCamelcasePipe,
    MessageTranslationPipe,
    GridButtonRendererComponentComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HomeModule,
    MasterModule,
    MilkCollectionModule,
    ConfigurationModule,
    ReportsModule,
    UserManagmentModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AgGridModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000
    }),
    MatFormFieldModule,
    MatIconModule,
  ],
  providers: [guardsGuard,DatePipe,MessageTranslationPipe,MessageUnderscoreToCamelcasePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
