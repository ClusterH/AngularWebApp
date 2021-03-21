import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { FuseSharedModule } from '@fuse/shared.module';
import { POIInfoPanelComponent } from 'app/main/home/maps/poiInfo-panel/poiInfo-panel.component';
import { SharedModule } from 'app/sharedModules/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { AgmDirectionModule, AgmDirection } from 'agm-direction';
import { UnitInfoService } from '../services/unitInfo.service';
import { AutocompletePOIDialogComponent } from 'app/main/home/maps/poiInfo-panel/autocomplete/autocomplete.component';

@NgModule({
    declarations: [
        POIInfoPanelComponent,
        AutocompletePOIDialogComponent
    ],
    imports: [
        MatDialogModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        AgmOverlays,
        AgmDirectionModule,
        FormsModule,
        FuseSharedModule,
        SharedModule
    ],
    exports: [POIInfoPanelComponent],
    providers: [UnitInfoService, GoogleMapsAPIWrapper, AgmDirection]

})
export class POIInfoPanelModule { }
