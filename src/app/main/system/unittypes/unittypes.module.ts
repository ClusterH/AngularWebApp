import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { UnittypesComponent } from 'app/main/system/unittypes/unittypes/unittypes.component';
import { UnittypesService } from 'app/main/system/unittypes/services/unittypes.service';
import { UnittypeDetailComponent } from 'app/main/system/unittypes/unittype_detail/unittype_detail.component';
import { UnittypeDetailService } from 'app/main/system/unittypes/services/unittype_detail.service';
import { CourseDialogComponent } from 'app/main/system/unittypes/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'unittypes', component: UnittypesComponent },
    { path: 'unittype_detail', component: UnittypeDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        UnittypesComponent,
        UnittypeDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        UnittypesService, UnittypeDetailService
    ]
})
export class UnitTypesModule { }