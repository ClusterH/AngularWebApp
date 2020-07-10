import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {OsmMapComponent} from "./osm-map/osm-map.component"

import { TranslateModule } from '@ngx-translate/core';

import { FuseShortcutsModule } from '@fuse/components';
import { FuseSidebarModule } from 'app/main/home/maps/sidebar/sidebar.module'
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseHighlightModule } from '@fuse/components/index';

import { OpenStreetMapComponent } from './osm.component';
import { UnitInfoPanelModule } from 'app/main/home/maps/unitInfo-panel/unitInfo-panel.module'
import { RoutesService } from 'app/main/home/maps/services/routes.service';
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';

const routes = [
    {
        path     : '**',
        component: OpenStreetMapComponent
    }
];

@NgModule({
    declarations: [
        OpenStreetMapComponent,
        OsmMapComponent
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
        LeafletModule,

        // AgmCoreModule.forRoot({
        //     apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4'
        // }),

        FuseSharedModule,
        FuseHighlightModule,
        FuseShortcutsModule,
        FuseSidebarModule,
        UnitInfoPanelModule
    ],
    providers :[
        VehMarkersService,
        UnitInfoService,
        ZonesService,
        RoutesService,
    ]
})
export class OpenStreetMapModule
{
}
