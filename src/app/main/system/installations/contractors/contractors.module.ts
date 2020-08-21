import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ContractorsComponent } from 'app/main/system/installations/contractors/contractors/contractors.component';
import { DeleteDialogComponent } from 'app/main/system/installations/contractors/deletedialog/deletedialog.component';
import { ContractorDialogComponent } from 'app/main/system/installations/contractors/dialog/dialog.component';
import { ContractorsService } from 'app/main/system/installations/contractors/services/contractors.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'contractors', component: ContractorsComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ContractorsComponent,
        ContractorDialogComponent,
        DeleteDialogComponent,
    ],
    providers: [ContractorsService]
})
export class ContractorsModule { }