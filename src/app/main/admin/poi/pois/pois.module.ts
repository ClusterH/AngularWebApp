import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/poi/pois/dialog/dialog.component';
import { PoisComponent } from 'app/main/admin/poi/pois/pois/pois.component';
import { PoiDetailComponent } from 'app/main/admin/poi/pois/poi_detail/poi_detail.component';
import { PoisService } from 'app/main/admin/poi/pois/services/pois.service';
import { PoiDetailService } from 'app/main/admin/poi/pois/services/poi_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'pois', component: PoisComponent },
    { path: 'poi_detail', component: PoiDetailComponent },
];

@NgModule({
    imports: [
        FuseSharedModule,
        MatDialogModule,
        TranslateModule,
        HttpClientModule,
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        PoisComponent,
        PoiDetailComponent,
        CourseDialogComponent,
    ],
    providers: [PoisService, PoiDetailService]
})
export class PoisModule { }