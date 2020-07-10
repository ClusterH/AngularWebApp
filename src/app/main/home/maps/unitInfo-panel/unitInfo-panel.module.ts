import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FuseSharedModule } from '@fuse/shared.module';

import { UnitInfoPanelComponent } from 'app/main/home/maps/unitInfo-panel/unitInfo-panel.component';

@NgModule({
    declarations: [
        UnitInfoPanelComponent
    ],
    imports     : [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,

        FuseSharedModule,
    ],
    exports: [
        UnitInfoPanelComponent
    ]
})
export class UnitInfoPanelModule
{
}
