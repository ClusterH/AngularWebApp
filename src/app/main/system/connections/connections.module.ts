import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { ConnectionsComponent } from 'app/main/system/connections/connections/connections.component';
import { ConnectionsService } from 'app/main/system/connections/services/connections.service';
import { ConnectionDetailComponent } from 'app/main/system/connections/connection_detail/connection_detail.component';
import { ConnectionDetailService } from 'app/main/system/connections/services/connection_detail.service';
import { CourseDialogComponent } from 'app/main/system/connections/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'connections', component: ConnectionsComponent },
    { path: 'connection_detail', component: ConnectionDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ConnectionsComponent,
        ConnectionDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ConnectionsService, ConnectionDetailService
    ]
})
export class ConnectionsModule { }