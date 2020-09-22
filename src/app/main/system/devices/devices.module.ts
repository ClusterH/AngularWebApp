import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { DevicesComponent } from 'app/main/system/devices/devices/devices.component';
import { DevicesService } from 'app/main/system/devices/services/devices.service';
import { DeviceDetailComponent } from 'app/main/system/devices/device_detail/device_detail.component';
import { DeviceDetailService } from 'app/main/system/devices/services/device_detail.service';
import { CourseDialogComponent } from 'app/main/system/devices/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'devices', component: DevicesComponent },
    { path: 'device_detail', component: DeviceDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        DevicesComponent,
        DeviceDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        DevicesService, DeviceDetailService
    ]
})
export class DevicesModule { }