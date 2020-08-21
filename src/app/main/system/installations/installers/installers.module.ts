import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InstallersComponent } from 'app/main/system/installations/installers/installers/installers.component';
import { DeleteDialogComponent } from 'app/main/system/installations/installers/deletedialog/deletedialog.component';
import { InstallerDialogComponent } from 'app/main/system/installations/installers/dialog/dialog.component';
import { InstallersService } from 'app/main/system/installations/installers/services/installers.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'installers', component: InstallersComponent },
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
        InstallersComponent,
        InstallerDialogComponent,
        DeleteDialogComponent,
    ],
    providers: [InstallersService]
})
export class InstallersModule { }