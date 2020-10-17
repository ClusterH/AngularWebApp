import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { GridsterModule } from 'angular2gridster';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { AnalyticsDashboardComponent } from 'app/main/home/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/home/analytics/analytics.service';
import { LayoutComponent } from 'app/main/home/analytics/components/layout/layout.component';
import { CourseDialogComponent } from "app/main/home/analytics/dialog/dialog.component";
import { NumberOfVehiclesDialogComponent } from "app/main/home/analytics/dialog/numberofvehiclesdialog/numberofvehiclesdialog.component";
import { StopcomplianceComponent } from 'app/main/home/analytics/components/stopcompliance/stopcompliance.component';
import { StopcomplianceSMComponent } from 'app/main/home/analytics/components/stopcompliancesm/stopcompliancesm.component';
import { MileageComponent } from 'app/main/home/analytics/components/mileage/mileage.component';
import { NumberOfVehiclesComponent } from 'app/main/home/analytics/components/numberofvehicles/numberofvehicles.component';
import { NumberOfUsersComponent } from 'app/main/home/analytics/components/numberofusers/numberofusers.component';

import { LayoutItemDirective } from 'app/main/home/analytics/directives/layout-item.directive';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes: Routes = [
    { path: '**', component: AnalyticsDashboardComponent, resolve: { data: AnalyticsDashboardService } }
];

@NgModule({
    declarations: [
        AnalyticsDashboardComponent,
        LayoutComponent,
        CourseDialogComponent,
        NumberOfVehiclesDialogComponent,
        StopcomplianceComponent,
        StopcomplianceSMComponent,
        MileageComponent,
        NumberOfVehiclesComponent,
        NumberOfUsersComponent,
        LayoutItemDirective
    ],
    imports: [
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'geometry']
        }),
        ChartsModule,
        GridsterModule.forRoot(),
        SatDatepickerModule,
        SatNativeDateModule,
        SharedModule
    ],
    providers: [AnalyticsDashboardService],
    entryComponents: [
        StopcomplianceComponent,
        StopcomplianceSMComponent,
        MileageComponent,
        NumberOfVehiclesComponent,
        NumberOfUsersComponent,
    ]
})
export class AnalyticsDashboardModule { }