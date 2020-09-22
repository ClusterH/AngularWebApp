import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmOverlays } from 'agm-overlays';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FuseShortcutsModule } from '@fuse/components';
import { FuseHighlightModule } from '@fuse/components/index';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RoutesService } from 'app/main/home/maps/services/routes.service';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { UnitInfoSidebarModule } from 'app/main/home/maps/sidebar/sidebar.module';
import { UnitInfoPanelModule } from 'app/main/home/maps/unitInfo-panel/unitInfo-panel.module';
import { FilterPanelModule } from 'app/main/home/maps/filter-panel/filter-panel.module';
import { TrackPanelModule } from 'app/main/home/maps/track-panel/track-panel.module';
import { DocsComponentsThirdPartyGoogleMapsComponent } from './google-maps.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from 'app/interceptors/https.interceptor';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: '**', component: DocsComponentsThirdPartyGoogleMapsComponent }
];

@NgModule({
    declarations: [DocsComponentsThirdPartyGoogleMapsComponent],
    imports: [
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
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        AgmOverlays,
        UnitInfoSidebarModule,
        FuseSharedModule,
        FuseHighlightModule,
        FuseShortcutsModule,
        UnitInfoPanelModule,
        FilterPanelModule,
        TrackPanelModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [
        VehMarkersService,
        UnitInfoService,
        ZonesService,
        RoutesService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ]
})
export class GoogleMapsModule { }
// AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ