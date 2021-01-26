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
import { RippleModule } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslateModule } from '@ngx-translate/core';
import { RoutePlanningComponent } from 'app/main/logistic/routeplanning/routeplanning/routeplanning.component';
import { SetStartValuesDialogComponent } from 'app/main/logistic/routeplanning/dialog/startvaluedialog/dialog.component';
import { CsvimporterComponent } from './components/csvimporter/csvimporter.component';
import { JoblistTableComponent } from './components/joblist-table/joblist-table.component';
import { DriverlistTableComponent } from './components/driverlist-table/driverlist-table.component';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { RoutelistTableComponent } from './components/routelist-table/routelist-table.component';
import { RoutelistMapComponent } from './components/routelist-map/routelist-map.component';
import { RoutelistHeaderComponent } from './components/routelist-header/routelist-header.component';
import { RoutelistBoardComponent } from './components/routelist-board/routelist-board.component';
import { JoblistDetailComponent } from './routeplanning_detail/joblist-detail/joblist-detail.component';
import { JobListDialogComponent } from './dialog/joblist-dialog/dialog.component';
import { DriverListDialogComponent } from './dialog/driverlist-dialog/dialog.component';
import {
    RoutePlanningService,
    RoutePlanningStorageService,
    CSVFileUploaderService,
    DisableControlDirective,
    RoutePlanningJobService,
    RoutePlanningDriverService,
    RoutePlanningRouteService
} from './services';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'routeplanning', component: RoutePlanningComponent },
    { path: 'jobdetail', component: JoblistDetailComponent },
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
        DialogModule,
        PaginatorModule,
        ButtonModule,
        RadioButtonModule,
        RippleModule,
        CalendarModule,
        CheckboxModule,
        OverlayPanelModule,
        ProgressBarModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        RoutePlanningComponent,
        SetStartValuesDialogComponent,
        CsvimporterComponent,
        JoblistTableComponent,
        DriverlistTableComponent,
        DisableControlDirective,
        DragDropComponent,
        RoutelistTableComponent,
        RoutelistMapComponent,
        RoutelistHeaderComponent,
        RoutelistBoardComponent,
        JoblistDetailComponent,
        JobListDialogComponent,
        DriverListDialogComponent
    ],
    providers: [
        RoutePlanningService,
        RoutePlanningStorageService,
        RoutePlanningJobService,
        RoutePlanningDriverService,
        RoutePlanningRouteService,
        CSVFileUploaderService,
        GoogleMapsAPIWrapper,
        AgmDirection
    ]
})
export class RoutePlanningModule { }