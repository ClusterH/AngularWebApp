import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DevConfigsComponent } from 'app/main/system/devconfigs/devconfigs/devconfigs.component';
import { DevConfigDetailComponent } from 'app/main/system/devconfigs/devconfig_detail/devconfig_detail.component';
import { CourseDialogComponent } from 'app/main/system/devconfigs/dialog/dialog.component';
import { DevConfigsService } from 'app/main/system/devconfigs/services/devconfigs.service';
import { DevConfigDetailService } from 'app/main/system/devconfigs/services/devconfig_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'devconfigs', component: DevConfigsComponent },
    { path: 'devconfig_detail', component: DevConfigDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        DevConfigsComponent,
        DevConfigDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        DevConfigsService, DevConfigDetailService
    ]
})
export class DevConfigsModule { }