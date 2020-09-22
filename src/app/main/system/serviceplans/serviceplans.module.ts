import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { ServiceplansComponent } from 'app/main/system/serviceplans/serviceplans/serviceplans.component';
import { ServiceplansService } from 'app/main/system/serviceplans/services/serviceplans.service';
import { ServiceplanDetailComponent } from 'app/main/system/serviceplans/serviceplan_detail/serviceplan_detail.component';
import { ServiceplanDetailService } from 'app/main/system/serviceplans/services/serviceplan_detail.service';
import { CourseDialogComponent } from 'app/main/system/serviceplans/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'serviceplans', component: ServiceplansComponent },
    { path: 'serviceplan_detail', component: ServiceplanDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ServiceplansComponent,
        ServiceplanDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ServiceplansService, ServiceplanDetailService
    ]
})
export class ServiceplansModule { }