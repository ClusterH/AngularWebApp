import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseSharedModule } from '@fuse/shared.module';
import { UnitInfoPanelComponent } from 'app/main/home/maps/unitInfo-panel/unitInfo-panel.component';
import { SharedModule } from 'app/sharedModules/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnitInfoService } from '../services/unitInfo.service';

@NgModule({
    declarations: [
        UnitInfoPanelComponent
    ],
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
    exports: [UnitInfoPanelComponent],
    providers: [UnitInfoService]

})
export class UnitInfoPanelModule { }
