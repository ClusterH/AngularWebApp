import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { PrivilegesComponent } from 'app/main/system/privileges/privileges/privileges.component';
import { PrivilegesService } from 'app/main/system/privileges/services/privileges.service';
import { PrivilegeDetailComponent } from 'app/main/system/privileges/privilege_detail/privilege_detail.component';
import { PrivilegeDetailService } from 'app/main/system/privileges/services/privilege_detail.service';
import { CourseDialogComponent } from 'app/main/system/privileges/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'privileges', component: PrivilegesComponent },
    { path: 'privilege_detail', component: PrivilegeDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        PrivilegesComponent,
        PrivilegeDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        PrivilegesService, PrivilegeDetailService
    ]
})
export class PrivilegesModule { }