import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
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
