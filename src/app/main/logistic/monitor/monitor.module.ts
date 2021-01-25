import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmOverlays } from 'agm-overlays';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule, AgmDirection } from 'agm-direction';

import { MatDialogModule } from "@angular/material/dialog";
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

import { AngularSplitModule } from 'angular-split';

import { TranslateModule } from '@ngx-translate/core';
import { MonitorComponent } from 'app/main/logistic/monitor/monitor/monitor.component';
import { MonitorService } from 'app/main/logistic/monitor/services/monitor.service';
import { ReportContactDialogComponent } from 'app/main/logistic/monitor/dialog/reportHistory/reportHistoryDialog.component';
import { NewTripDialogComponent } from 'app/main/logistic/monitor/dialog/newTrip/newTripDialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';
import { TriplistComponent } from './components/triplist/triplist.component';
import { MonitormapComponent } from './components/monitormap/monitormap.component';

const routes = [
    { path: 'monitor', component: MonitorComponent },
];

@NgModule({
    imports: [
        FormsModule,
        MatDialogModule,
        AgmJsMarkerClustererModule,
        AgmDrawingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        AgmOverlays,
        AgmDirectionModule,
        TableModule,
        PaginatorModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        TranslateModule,
        RouterModule.forChild(routes),
        AngularSplitModule,
        SharedModule
    ],
    declarations: [
        MonitorComponent,
        ReportContactDialogComponent,
        NewTripDialogComponent,
        TriplistComponent,
        MonitormapComponent
    ],
    providers: [MonitorService, GoogleMapsAPIWrapper, AgmDirection]
})
export class MonitorModule { }