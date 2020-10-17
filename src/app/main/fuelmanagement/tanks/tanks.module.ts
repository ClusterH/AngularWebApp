import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { TanksComponent } from 'app/main/fuelmanagement/tanks/tanks/tanks.component';
import { TanksService } from 'app/main/fuelmanagement/tanks/services/tanks.service';
import { TankDetailComponent } from 'app/main/fuelmanagement/tanks/tank_detail/tank_detail.component';
import { TankDetailEditComponent } from 'app/main/fuelmanagement/tanks/tank_detail_edit/tank_detail_edit.component';
import { TankDetailService } from 'app/main/fuelmanagement/tanks/services/tank_detail.service';
import { CourseDialogComponent } from 'app/main/fuelmanagement/tanks/dialog/dialog.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import 'hammerjs';
import 'chartjs-plugin-zoom';
import { SharedModule } from 'app/sharedModules/shared.module';


const routes = [
    { path: 'tanks', component: TanksComponent },
    { path: 'tank_detail', component: TankDetailComponent },
    { path: 'tank_detail_edit', component: TankDetailEditComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        SatDatepickerModule,
        SatNativeDateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        TanksComponent,
        TankDetailComponent,
        TankDetailEditComponent,
        CourseDialogComponent,
    ],
    providers: [TanksService, TankDetailService]
})
export class TanksModule { }