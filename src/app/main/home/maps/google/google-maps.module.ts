import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmOverlays } from 'agm-overlays';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

import { FuseShortcutsModule } from '@fuse/components';
import { FuseHighlightModule } from '@fuse/components/index';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RoutesService, UnitInfoService, VehMarkersService, ZonesService } from '../services';
import { AgmDirectionGeneratorService } from 'app/sharedModules/services';
import { UnitInfoSidebarModule } from 'app/main/home/maps/sidebar/sidebar.module';
import { UnitInfoPanelModule } from 'app/main/home/maps/unitInfo-panel/unitInfo-panel.module';
import { POIInfoPanelModule } from 'app/main/home/maps/poiInfo-panel/poiInfo-panel.module';
import { FilterPanelModule } from 'app/main/home/maps/filter-panel/filter-panel.module';
import { TrackPanelModule } from 'app/main/home/maps/track-panel/track-panel.module';
import { DocsComponentsThirdPartyGoogleMapsComponent } from './google-maps.component';
import {
    MatFabButtonComponent,
    CreateRouteOptionComponent,
    StopsFileDragDropComponent,
    SaveRouteDialogComponent,
    MeasurePanelComponent,
    CreateZoneDialogComponent,
    CreateZoneOptionComponent
} from '../components';

import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: '**', component: DocsComponentsThirdPartyGoogleMapsComponent }
];

@NgModule({
    declarations: [
        DocsComponentsThirdPartyGoogleMapsComponent,
        MatFabButtonComponent,
        CreateRouteOptionComponent,
        StopsFileDragDropComponent,
        SaveRouteDialogComponent,
        MeasurePanelComponent,
        CreateZoneDialogComponent,
        CreateZoneOptionComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        DialogModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        AgmJsMarkerClustererModule,
        AgmDrawingModule,
        AgmOverlays,
        FuseSharedModule,
        FuseHighlightModule,
        FuseShortcutsModule,
        TranslateModule,
        UnitInfoSidebarModule,
        UnitInfoPanelModule,
        POIInfoPanelModule,
        FilterPanelModule,
        TrackPanelModule,
        SharedModule
    ],
    providers: [
        VehMarkersService,
        UnitInfoService,
        ZonesService,
        RoutesService,
        AgmDirectionGeneratorService
    ]
})
export class GoogleMapsModule { }
// AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ