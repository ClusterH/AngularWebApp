import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { ServiceplansComponent } from 'app/main/system/serviceplans/serviceplans/serviceplans.component';
import { ServiceplansService } from 'app/main/system/serviceplans/services/serviceplans.service';
import { ServiceplanDetailComponent } from 'app/main/system/serviceplans/serviceplan_detail/serviceplan_detail.component';
import { ServiceplanDetailService } from 'app/main/system/serviceplans/services/serviceplan_detail.service';
import { CourseDialogComponent } from 'app/main/system/serviceplans/dialog/dialog.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from 'app/interceptors/https.interceptor';

const routes = [
    {
        path: 'serviceplans',
        component: ServiceplansComponent,
        // pathMatch: 'full'
    },
    {
        path: 'serviceplan_detail',
        component: ServiceplanDetailComponent,
        // pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        FuseSharedModule,
        FuseConfirmDialogModule,
        NgxMatSelectSearchModule,

        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatProgressSpinnerModule,

        TranslateModule,
        HttpClientModule,

        NgSelectModule,
        BlockUIModule,

        NgbModule,
        CommonModule,
        UiSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ServiceplansComponent,
        ServiceplanDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ServiceplansService, ServiceplanDetailService, { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ]
})
export class ServiceplansModule { }
