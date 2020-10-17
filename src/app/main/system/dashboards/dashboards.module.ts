import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { DashboardsComponent } from 'app/main/system/dashboards/dashboards/dashboards.component';
import { DashboardsService } from 'app/main/system/dashboards/services/dashboards.service';
import { DashboardDetailComponent } from 'app/main/system/dashboards/dashboard_detail/dashboard_detail.component';
import { DashboardDetailService } from 'app/main/system/dashboards/services/dashboard_detail.service';
import { CourseDialogComponent } from 'app/main/system/dashboards/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'dashboards', component: DashboardsComponent },
    { path: 'dashboard_detail', component: DashboardDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        DashboardsComponent,
        DashboardDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        DashboardsService, DashboardDetailService
    ]
})
export class DashboardsModule { }