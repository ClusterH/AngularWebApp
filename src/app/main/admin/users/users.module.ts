import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/users/dialog/dialog.component';
import { UsersService } from 'app/main/admin/users/services/users.service';
import { UserDetailService } from 'app/main/admin/users/services/user_detail.service';
import { UsersComponent } from 'app/main/admin/users/users/users.component';
import { UserDetailComponent } from 'app/main/admin/users/user_detail/user_detail.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'users', component: UsersComponent },
    { path: 'user_detail', component: UserDetailComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        TranslateModule,
        MatDialogModule,
        SharedModule
    ],
    declarations: [
        UsersComponent,
        UserDetailComponent,
        CourseDialogComponent,
    ],
    providers: [UsersService, UserDetailService]
})
export class UsersModule { }