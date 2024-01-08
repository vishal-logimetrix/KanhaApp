import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'forgot/password', component: ForgotPasswordComponent},
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  // { path: 'home/dashboard', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
