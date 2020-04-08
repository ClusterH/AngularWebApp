import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
// import { AnalyticsDashboardModule } from 'app/main/home/analytics/analytics.module';

const appRoutes: Routes = [
    {
        path        : 'login',
        loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule)
    },
    {
        path        : 'forgot-password',
        loadChildren: () => import('./authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
    },
    {
        path        : 'register',
        loadChildren: () => import('./authentication/register/register.module').then(m => m.RegisterModule)
    },
    {
        path        : 'home',
        loadChildren: () => import('./main/home/apps.module').then(m => m.AppsModule)
    },
    {
        path        : 'admin',
        loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule)
    },
    {
        path        : 'system',
        loadChildren: () => import('./main/system/system.module').then(m => m.SystemModule)
    },
    {
        path        : 'report',
        loadChildren: () => import('./main/report/report.module').then(m => m.ReportModule)
    },
    {
        path      : '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],                                                                                                                                                                     
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),

        NgbModule,

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),


        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
