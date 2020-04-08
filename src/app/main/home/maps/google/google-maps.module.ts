import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmDrawingModule } from '@agm/drawing';
import {MatToolbarModule} from '@angular/material/toolbar'; 

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseHighlightModule } from '@fuse/components/index';

import { DocsComponentsThirdPartyGoogleMapsComponent } from './google-maps.component';

import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { RoutesService } from 'app/main/home/maps/services/routes.service';

const routes = [
    {
        path     : '**',
        component: DocsComponentsThirdPartyGoogleMapsComponent
    }
];

@NgModule({
    declarations: [
        DocsComponentsThirdPartyGoogleMapsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatIconModule,

        AgmJsMarkerClustererModule,
        AgmDrawingModule,
        MatToolbarModule,
        MatButtonToggleModule,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ',
            libraries: ['places', 'drawing', 'geometry'],
        }),

        FuseSharedModule,
        FuseHighlightModule
    ],
    providers :[
        VehMarkersService,
        ZonesService,
        RoutesService
    ]
})
export class GoogleMapsModule
{
}
