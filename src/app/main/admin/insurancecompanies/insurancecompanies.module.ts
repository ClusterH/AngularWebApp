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

import { InsuranceCompaniesComponent} from 'app/main/admin/insurancecompanies/insurancecompanies/insurancecompanies.component';
import { InsuranceCompaniesService } from 'app/main/admin/insurancecompanies/services/insurancecompanies.service';
import { InsuranceCompanyDetailComponent} from 'app/main/admin/insurancecompanies/insurancecompany_detail/insurancecompany_detail.component';
import { InsuranceCompanyDetailService } from 'app/main/admin/insurancecompanies/services/insurancecompany_detail.service';
import { CourseDialogComponent } from 'app/main/admin/insurancecompanies/dialog/dialog.component';
import { StylePaginatorDirective } from 'app/main/admin/insurancecompanies/insurancecompanies/style-paginator.directive';

import { HttpClientModule } from '@angular/common/http';

const routes = [
    {
        path     : 'insurancecompanies',
        component: InsuranceCompaniesComponent,
        // pathMatch: 'full'
    },
    {
        path     : 'insurancecompany_detail',
        component: InsuranceCompanyDetailComponent,
        // pathMatch: 'full'
    },
];

@NgModule({
    imports     : [
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
        InsuranceCompaniesComponent,
        InsuranceCompanyDetailComponent,
        CourseDialogComponent,
        StylePaginatorDirective
    ],
    providers: [
        InsuranceCompaniesService, InsuranceCompanyDetailService
    ]
})
export class InsuranceCompaniesModule{ }
