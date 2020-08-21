import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/operators/dialog/dialog.component';
import { OperatorsComponent } from 'app/main/admin/operators/operators/operators.component';
import { OperatorDetailComponent } from 'app/main/admin/operators/operator_detail/operator_detail.component';
import { OperatorsService } from 'app/main/admin/operators/services/operators.service';
import { OperatorDetailService } from 'app/main/admin/operators/services/operator_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    {
        path: 'operators',
        component: OperatorsComponent,
        // pathMatch: 'full'
    },
    {
        path: 'operator_detail',
        component: OperatorDetailComponent,
        // pathMatch: 'full'
    },
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
        OperatorsComponent,
        OperatorDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        OperatorsService, OperatorDetailService
    ]
})
export class OperatorsModule { }
