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

import { DealerCompaniesComponent} from 'app/main/admin/dealercompanies/dealercompanies/dealercompanies.component';
import { DealerCompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { DealerCompanyDetailComponent} from 'app/main/admin/dealercompanies/dealercompany_detail/dealercompany_detail.component';
import { DealerCompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import { CourseDialogComponent } from 'app/main/admin/dealercompanies/dialog/dialog.component';
import { StylePaginatorDirective } from 'app/main/admin/dealercompanies/dealercompanies/style-paginator.directive';

import { HttpClientModule } from '@angular/common/http';

const routes = [
    {
        path     : 'dealercompanies',
        component: DealerCompaniesComponent,
        // pathMatch: 'full'
    },
    {
        path     : 'dealercompany_detail',
        component: DealerCompanyDetailComponent,
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
        DealerCompaniesComponent,
        DealerCompanyDetailComponent,
        CourseDialogComponent,
        StylePaginatorDirective
    ],
    providers: [
        DealerCompaniesService, DealerCompanyDetailService
    ]
})
export class DealerCompaniesModule{ }