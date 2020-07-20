import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuicklinkStrategy, QuicklinkModule } from 'ngx-quicklink';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from 'app/fake-db/fake-db.service';
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
        HttpClientModule,
        QuicklinkModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: QuicklinkStrategy }),
        // RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
        NgbModule,
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, { delay: 0, passThruUnknownUrl: true }),
        MatMomentDateModule,
        MatButtonModule,
        MatIconModule,
        NgxPaginationModule,
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        LayoutModule,
        AppStoreModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }