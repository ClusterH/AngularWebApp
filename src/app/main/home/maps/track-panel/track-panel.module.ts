import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ColorPickerModule } from 'ngx-color-picker';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseMaterialColorPickerModule } from '@fuse/components';
import { SharedModule } from 'app/sharedModules/shared.module';

import { TrackPanelComponent } from 'app/main/home/maps/track-panel/track-panel.component';
import { TrackPanelService } from '../services/trackpanel.service';
import { UnitInfoService } from '../services/unitInfo.service';

@NgModule({
    declarations: [TrackPanelComponent],
    imports: [
        NgxPaginationModule,
        ColorPickerModule,
        ReactiveFormsModule,
        FormsModule,
        FuseSharedModule,
        FuseMaterialColorPickerModule,
        SharedModule
    ],
    exports: [TrackPanelComponent],
    providers: [TrackPanelService, UnitInfoService]
})
export class TrackPanelModule { }
