import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';
import { FuseHighlightModule } from '@fuse/components/index';
import { FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarComponent } from '@fuse/components/sidebar/sidebar.component'
import { RoutesService } from 'app/main/home/maps/services/routes.service';
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { DocsComponentsThirdPartyGoogleMapsComponent } from './google-maps.component';

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
        MatMenuModule,
        TranslateModule,
        AgmJsMarkerClustererModule,
        AgmDrawingModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatSelectModule,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ',
            libraries: ['places', 'drawing', 'geometry'],
        }),

        FuseSharedModule,
        FuseHighlightModule,
        FuseShortcutsModule
    ],
    providers :[
        VehMarkersService,
        ZonesService,
        RoutesService,
        FuseSidebarComponent
    ]
})
export class GoogleMapsModule
{
}
