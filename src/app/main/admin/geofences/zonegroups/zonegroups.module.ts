import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { ZonegroupsComponent } from 'app/main/admin/geofences/zonegroups/zonegroups/zonegroups.component';
import { ZonegroupsService } from 'app/main/admin/geofences/zonegroups/services/zonegroups.service';
import { ZonegroupDetailComponent } from 'app/main/admin/geofences/zonegroups/zonegroup_detail/zonegroup_detail.component';
import { ZonegroupDetailService } from 'app/main/admin/geofences/zonegroups/services/zonegroup_detail.service';
import { CourseDialogComponent } from 'app/main/admin/geofences/zonegroups/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    {
        path: 'zonegroups',
        component: ZonegroupsComponent,
        // pathMatch: 'full'
    },
    {
        path: 'zonegroup_detail',
        component: ZonegroupDetailComponent,
    },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ZonegroupsComponent,
        ZonegroupDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ZonegroupsService, ZonegroupDetailService
    ]
})
export class ZonegroupsModule { }
