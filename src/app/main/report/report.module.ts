import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
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
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatStepperModule } from '@angular/material/stepper';

import { TextMaskModule } from 'angular2-text-mask';

import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { ReportComponent } from 'app/main/report/reportcomponent/report.component';
import { ReportResultComponent } from 'app/main/report/reportcomponent/reportresult/reportresult.component';
import { ReportService } from 'app/main/report/reportcomponent/services/report.service';
import { ReportResultService } from 'app/main/report/reportcomponent/services/reportresult.service';

import { CourseDialogComponent } from 'app/main/report/reportcomponent/dialog/dialog.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from 'app/interceptors/https.interceptor';

const routes = [
    {
        path: 'reportcomponent/:id',
        component: ReportComponent,
    },
    {
        path: 'reportresult',
        component: ReportResultComponent,
    },
];

@NgModule({
    imports: [
        FuseSharedModule,
        FuseConfirmDialogModule,
        NgxMatSelectSearchModule,

        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
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
        MatSnackBarModule,
        MatTableModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatStepperModule,

        TranslateModule,
        HttpClientModule,

        TextMaskModule,

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
        ReportComponent,
        ReportResultComponent,
        CourseDialogComponent,
    ],
    providers: [
        ReportService, ReportResultService, { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ]
})
export class ReportModule { }
