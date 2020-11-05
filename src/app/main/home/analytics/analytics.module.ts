import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { GridsterModule } from 'angular2gridster';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { AnalyticsDashboardComponent } from 'app/main/home/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/home/analytics/analytics.service';
import { LayoutComponent } from 'app/main/home/analytics/components/layout/layout.component';
import { CourseDialogComponent } from "app/main/home/analytics/dialog/mileagedialog/dialog.component";
import { MPGDialogComponent } from "app/main/home/analytics/dialog/mpgdialog/dialog.component";
import { NumberOfVehiclesDialogComponent } from "app/main/home/analytics/dialog/numberofvehiclesdialog/numberofvehiclesdialog.component";
import { NumberOfUsersDialogComponent } from "app/main/home/analytics/dialog/numberofusersdialog/numberofusersdialog.component";
import { StopcomplianceComponent } from 'app/main/home/analytics/components/stopcompliance/stopcompliance.component';
import { StopcomplianceSMComponent } from 'app/main/home/analytics/components/stopcompliancesm/stopcompliancesm.component';
import { MileageComponent } from 'app/main/home/analytics/components/mileage/mileage.component';
import { MpgComponent } from 'app/main/home/analytics/components/mpg/mpg.component';
import { NumberOfVehiclesComponent } from 'app/main/home/analytics/components/numberofvehicles/numberofvehicles.component';
import { NumberOfUsersComponent } from 'app/main/home/analytics/components/numberofusers/numberofusers.component';
import { TranslateModule } from '@ngx-translate/core';
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
        MPGDialogComponent,
        NumberOfVehiclesDialogComponent,
        NumberOfUsersDialogComponent,
        StopcomplianceComponent,
        StopcomplianceSMComponent,
        MileageComponent,
        MpgComponent,
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
        MatSlideToggleModule,
        SatDatepickerModule,
        SatNativeDateModule,
        TranslateModule,
        SharedModule
    ],
    providers: [AnalyticsDashboardService],
    entryComponents: [
        StopcomplianceComponent,
        StopcomplianceSMComponent,
        MileageComponent,
        MpgComponent,
        NumberOfVehiclesComponent,
        NumberOfUsersComponent,
    ]
})
export class AnalyticsDashboardModule { }