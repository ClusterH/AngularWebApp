import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { AccountsComponent } from 'app/main/system/accounts/accounts/accounts.component';
import { AccountsService } from 'app/main/system/accounts/services/accounts.service';
import { AccountDetailComponent } from 'app/main/system/accounts/account_detail/account_detail.component';
import { AccountDetailService } from 'app/main/system/accounts/services/account_detail.service';
import { CourseDialogComponent } from 'app/main/system/accounts/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'accounts', component: AccountsComponent },
    { path: 'account_detail', component: AccountDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        AccountsComponent,
        AccountDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        AccountsService, AccountDetailService
    ]
})
export class AccountsModule { }