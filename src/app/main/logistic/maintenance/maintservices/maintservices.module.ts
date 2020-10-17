import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { MaintservicesComponent } from 'app/main/logistic/maintenance/maintservices/maintservices/maintservices.component';
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service';
import { MaintserviceDialogComponent } from 'app/main/logistic/maintenance/maintservices/dialog/dialog.component';
import { DeleteDialogComponent } from 'app/main/logistic/maintenance/maintservices/deletedialog/deletedialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'maintservices', component: MaintservicesComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        MaintservicesComponent,
        MaintserviceDialogComponent,
        DeleteDialogComponent,
    ],
    providers: [MaintservicesService]
})
export class MaintservicesModule { }