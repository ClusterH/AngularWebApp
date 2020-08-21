import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JobsComponent } from 'app/main/system/installations/jobs/jobs/jobs.component';
import { DeleteDialogComponent } from 'app/main/system/installations/jobs/deletedialog/deletedialog.component';
import { JobDialogComponent } from 'app/main/system/installations/jobs/dialog/dialog.component';
import { JobsService } from 'app/main/system/installations/jobs/services/jobs.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'jobs', component: JobsComponent },
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
        JobsComponent,
        JobDialogComponent,
        DeleteDialogComponent,
    ],
    providers: [JobsService]
})
export class JobsModule { }