import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { HistoryComponent } from 'app/main/logistic/maintenance/history/history/history.component';
import { HistoryService } from 'app/main/logistic/maintenance/history/services/history.service';
import { AttendDialogComponent } from 'app/main/logistic/maintenance/history/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'history', component: HistoryComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        HistoryComponent,
        AttendDialogComponent,
    ],
    providers: [
        HistoryService
    ]
})
export class HistoryModule { }