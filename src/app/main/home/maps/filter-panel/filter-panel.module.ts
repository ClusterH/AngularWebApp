import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/sharedModules/shared.module';

import { FilterPanelComponent } from 'app/main/home/maps/filter-panel/filter-panel.component';
import { FilterPanelService } from '../services/searchfilterpanel.service';
import { UnitInfoService } from '../services/unitInfo.service';

@NgModule({
    declarations: [FilterPanelComponent],
    imports: [
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        FuseSharedModule,
        SharedModule
    ],
    exports: [FilterPanelComponent],
    providers: [FilterPanelService, UnitInfoService]
})
export class FilterPanelModule { }
