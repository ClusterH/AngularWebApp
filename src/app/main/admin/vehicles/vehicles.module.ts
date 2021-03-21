import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/vehicles/dialog/dialog.component';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { VehiclesComponent } from 'app/main/admin/vehicles/vehicles/vehicles.component';
import { VehicleDetailComponent } from 'app/main/admin/vehicles/vehicle_detail/vehicle_detail.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'vehicles/:type', component: VehiclesComponent },
    { path: 'vehicle_detail/:type', component: VehicleDetailComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MatDialogModule,
        TranslateModule,
        SharedModule
    ],
    declarations: [
        VehiclesComponent,
        VehicleDetailComponent,
        CourseDialogComponent,
    ],
    providers: [VehiclesService, VehicleDetailService]
})
export class VehiclesModule { }