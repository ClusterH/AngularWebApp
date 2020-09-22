import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { MakesComponent } from 'app/main/admin/makes/makes/makes.component';
import { MakesService } from 'app/main/admin/makes/services/makes.service';
import { MakeDetailComponent } from 'app/main/admin/makes/make_detail/make_detail.component';
import { MakeDetailService } from 'app/main/admin/makes/services/make_detail.service';
import { CourseDialogComponent } from 'app/main/admin/makes/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'makes', component: MakesComponent },
    { path: 'make_detail', component: MakeDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        MakesComponent,
        MakeDetailComponent,
        CourseDialogComponent,
    ],
    providers: [MakesService, MakeDetailService]
})
export class MakesModule { }