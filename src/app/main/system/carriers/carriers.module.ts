import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { CarriersComponent } from 'app/main/system/carriers/carriers/carriers.component';
import { CarriersService } from 'app/main/system/carriers/services/carriers.service';
import { CarrierDetailComponent } from 'app/main/system/carriers/carrier_detail/carrier_detail.component';
import { CarrierDetailService } from 'app/main/system/carriers/services/carrier_detail.service';
import { CourseDialogComponent } from 'app/main/system/carriers/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'carriers', component: CarriersComponent },
    { path: 'carrier_detail', component: CarrierDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        CarriersComponent,
        CarrierDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        CarriersService, CarrierDetailService
    ]
})
export class CarriersModule { }