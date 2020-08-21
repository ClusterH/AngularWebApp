import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from "@angular/material/dialog";
import { FuseSharedModule } from '@fuse/shared.module';
import { UnitInfoPanelComponent } from 'app/main/home/maps/unitInfo-panel/unitInfo-panel.component';
import { SharedModule } from 'app/sharedModules/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { AgmDirectionModule, AgmDirection } from 'agm-direction';
import { UnitInfoService } from '../services/unitInfo.service';
import { UnitLinkDialogComponent } from 'app/main/home/maps/unitInfo-panel/dialog/dialog.component';
import { AutocompleteDialogComponent } from 'app/main/home/maps/unitInfo-panel/autocomplete/autocomplete.component';

@NgModule({
    declarations: [
        UnitInfoPanelComponent, UnitLinkDialogComponent, AutocompleteDialogComponent
    ],
    imports: [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
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
    exports: [UnitInfoPanelComponent],
    providers: [UnitInfoService, GoogleMapsAPIWrapper, AgmDirection]

})
export class UnitInfoPanelModule { }
