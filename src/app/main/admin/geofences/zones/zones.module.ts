import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { ZonesComponent } from 'app/main/admin/geofences/zones/zones/zones.component';
import { ZonesService } from 'app/main/admin/geofences/zones/services/zones.service';
import { ZoneDetailComponent } from 'app/main/admin/geofences/zones/zone_detail/zone_detail.component';
import { ZoneDetailService } from 'app/main/admin/geofences/zones/services/zone_detail.service';
import { CourseDialogComponent } from 'app/main/admin/geofences/zones/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    {
        path: 'zones',
        component: ZonesComponent,
        // pathMatch: 'full'
    },
    {
        path: 'zone_detail',
        component: ZoneDetailComponent,
        // pathMatch: 'full'
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
        ZonesComponent,
        ZoneDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ZonesService, ZoneDetailService,
    ]
})
export class ZonesModule { }
