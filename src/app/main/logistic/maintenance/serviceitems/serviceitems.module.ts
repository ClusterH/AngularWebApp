import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { ServiceitemsComponent } from 'app/main/logistic/maintenance/serviceitems/serviceitems/serviceitems.component';
import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';
import { ServiceItemDialogComponent } from 'app/main/logistic/maintenance/serviceitems/dialog/dialog.component';
import { DeleteDialogComponent } from 'app/main/logistic/maintenance/serviceitems/deletedialog/deletedialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'serviceitems', component: ServiceitemsComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ServiceitemsComponent,
        ServiceItemDialogComponent,
        DeleteDialogComponent,
    ],
    providers: [
        ServiceitemsService
    ]
})
export class ServiceitemsModule { }