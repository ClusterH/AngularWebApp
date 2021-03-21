import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./core/authentication/login/login.module').then(m => m.LoginModule) },
  { path: 'home', loadChildren: () => import('./main/home/home.module').then(m => m.HomeModule) },
  { path: 'admin', loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule) },
  { path: 'system', loadChildren: () => import('./main/system/system.module').then(m => m.SystemModule) },
  { path: 'report', loadChildren: () => import('./main/report/report.module').then(m => m.ReportModule) },
  { path: 'logistic', loadChildren: () => import('./main/logistic/logistic.module').then(m => m.LogisticModule) },
  { path: 'fuelmanagement', loadChildren: () => import('./main/fuelmanagement/fuelmanagement.module').then(m => m.FuelmanagementModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
