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

import { TranslateModule } from '@ngx-translate/core';
import { RouteCenterComponent } from 'app/main/logistic/routecenter/routecenter/routecenter.component';
import { RouteCenterService } from 'app/main/logistic/routecenter/services/routecenter.service';
import { RouteCenterDialogComponent } from 'app/main/logistic/routecenter/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'routecenter', component: RouteCenterComponent },
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
        SharedModule
    ],
    declarations: [
        RouteCenterComponent,
        RouteCenterDialogComponent,
    ],
    providers: [RouteCenterService, GoogleMapsAPIWrapper, AgmDirection]
})
export class RouteCenterModule { }