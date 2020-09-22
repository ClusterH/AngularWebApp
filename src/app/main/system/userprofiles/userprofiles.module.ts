import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { UserProfilesComponent } from 'app/main/system/userprofiles/userprofiles/userprofiles.component';
import { UserProfilesService } from 'app/main/system/userprofiles/services/userprofiles.service';
import { UserProfileDetailComponent } from 'app/main/system/userprofiles/userprofile_detail/userprofile_detail.component';
import { UserProfileDetailService } from 'app/main/system/userprofiles/services/userprofile_detail.service';
import { CourseDialogComponent } from 'app/main/system/userprofiles/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'userprofiles', component: UserProfilesComponent },
    { path: 'userprofile_detail', component: UserProfileDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        UserProfilesComponent,
        UserProfileDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        UserProfilesService, UserProfileDetailService
    ]
})
export class UserProfilesModule { }