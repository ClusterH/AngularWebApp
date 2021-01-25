import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { MatStepperModule } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { TranslateModule } from '@ngx-translate/core';
import { ReportComponent } from 'app/main/report/reportcomponent/report.component';
import { ReportResultComponent } from 'app/main/report/reportcomponent/reportresult/reportresult.component';
import { ReportResultService, ReportService, ExcelService, PDFService } from './reportcomponent/services';

import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'reportcomponent/:id', component: ReportComponent },
    { path: 'reportresult', component: ReportResultComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        MatStepperModule,
        TranslateModule,
        TextMaskModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ReportComponent,
        ReportResultComponent,
    ],
    providers: [ReportService, ReportResultService, ExcelService, PDFService, DatePipe]
})
export class ReportModule { }