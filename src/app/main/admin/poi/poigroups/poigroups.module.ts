import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { FuseHighlightModule } from '@fuse/components';
import { SharedModule } from 'app/sharedModules/shared.module';
import { CourseDialogComponent } from 'app/main/admin/poi/poigroups/dialog/dialog.component';
import { PoigroupsComponent } from 'app/main/admin/poi/poigroups/poigroups/poigroups.component';
import { PoigroupDetailComponent } from 'app/main/admin/poi/poigroups/poigroup_detail/poigroup_detail.component';
import { PoigroupsService } from 'app/main/admin/poi/poigroups/services/poigroups.service';
import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service';

const routes = [
    { path: 'poigroups', component: PoigroupsComponent },
    { path: 'poigroup_detail', component: PoigroupDetailComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseHighlightModule,
        MatMenuModule,
        MatListModule,
        SharedModule
    ],
    declarations: [PoigroupsComponent, PoigroupDetailComponent, CourseDialogComponent],
    providers: [PoigroupsService, PoigroupDetailService]
})
export class PoigroupsModule { }