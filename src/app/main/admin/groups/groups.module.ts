import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/groups/dialog/dialog.component';
import { GroupsComponent } from 'app/main/admin/groups/groups/groups.component';
import { GroupDetailComponent } from 'app/main/admin/groups/group_detail/group_detail.component';
import { GroupsService } from 'app/main/admin/groups/services/groups.service';
import { GroupDetailService } from 'app/main/admin/groups/services/group_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'groups', component: GroupsComponent },
    { path: 'group_detail', component: GroupDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        GroupsComponent,
        GroupDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        GroupsService, GroupDetailService
    ]
})
export class GroupsModule { }