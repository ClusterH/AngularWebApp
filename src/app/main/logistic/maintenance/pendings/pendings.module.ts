import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { PendingsComponent } from 'app/main/logistic/maintenance/pendings/pendings/pendings.component';
import { PendingsService } from 'app/main/logistic/maintenance/pendings/services/pendings.service';
import { AttendDialogComponent } from 'app/main/logistic/maintenance/pendings/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'pendings', component: PendingsComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        PendingsComponent,
        AttendDialogComponent,
    ],
    providers: [PendingsService]
})
export class PendingsModule { }