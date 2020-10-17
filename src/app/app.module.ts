import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinkStrategy, QuicklinkModule } from 'ngx-quicklink';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FuseModule } from '@fuse/fuse.module';
import { GridsterModule } from 'angular2gridster';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { fuseConfig } from 'app/fuse-config';
import { LayoutModule } from 'app/layout/layout.module';
import { AppStoreModule } from 'app/store/store.module';
import 'hammerjs';
import { AppComponent } from "app/app.component";
import { SharedModule } from 'app/sharedModules/shared.module';

const appRoutes: Routes = [
    { path: 'login', loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule) },
    { path: 'forgot-password', loadChildren: () => import('./authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
    { path: 'register', loadChildren: () => import('./authentication/register/register.module').then(m => m.RegisterModule) },
    { path: 'home', loadChildren: () => import('./main/home/home.module').then(m => m.HomeModule) },
    { path: 'admin', loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule) },
    { path: 'system', loadChildren: () => import('./main/system/system.module').then(m => m.SystemModule) },
    { path: 'report', loadChildren: () => import('./main/report/report.module').then(m => m.ReportModule) },
    { path: 'logistic', loadChildren: () => import('./main/logistic/logistic.module').then(m => m.LogisticModule) },
    { path: 'fuelmanagement', loadChildren: () => import('./main/fuelmanagement/fuelmanagement.module').then(m => m.FuelmanagementModule) },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        QuicklinkModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: QuicklinkStrategy }),
        TranslateModule.forRoot(),
        NgxPaginationModule,
        FuseModule.forRoot(fuseConfig),
        GridsterModule,
        LayoutModule,
        AppStoreModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }