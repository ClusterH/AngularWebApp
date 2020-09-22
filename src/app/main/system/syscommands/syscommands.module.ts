import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { SysCommandsComponent } from 'app/main/system/syscommands/syscommands/syscommands.component';
import { SysCommandsService } from 'app/main/system/syscommands/services/syscommands.service';
import { SysCommandDetailComponent } from 'app/main/system/syscommands/syscommand_detail/syscommand_detail.component';
import { SysCommandDetailService } from 'app/main/system/syscommands/services/syscommand_detail.service';
import { CourseDialogComponent } from 'app/main/system/syscommands/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'syscommands', component: SysCommandsComponent },
    { path: 'syscommand_detail', component: SysCommandDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        SysCommandsComponent,
        SysCommandDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        SysCommandsService, SysCommandDetailService
    ]
})
export class SysCommandsModule { }
