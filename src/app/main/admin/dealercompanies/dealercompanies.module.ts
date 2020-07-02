import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FuseConfirmDialogModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { DealerCompaniesComponent } from 'app/main/admin/dealercompanies/dealercompanies/dealercompanies.component';
import { StylePaginatorDirective } from 'app/main/admin/dealercompanies/dealercompanies/style-paginator.directive';
import { DealerCompanyDetailComponent } from 'app/main/admin/dealercompanies/dealercompany_detail/dealercompany_detail.component';
import { CourseDialogComponent } from 'app/main/admin/dealercompanies/dialog/dialog.component';
import { DealerCompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { DealerCompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes = [
    {
        path: 'dealercompanies',
        component: DealerCompaniesComponent,
        // pathMatch: 'full'
    },
    {
        path: 'dealercompany_detail',
        component: DealerCompanyDetailComponent,
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
        DealerCompaniesComponent,
        DealerCompanyDetailComponent,
        CourseDialogComponent,
        StylePaginatorDirective
    ],
    providers: [
        DealerCompaniesService, DealerCompanyDetailService
    ]
})
export class DealerCompaniesModule { }
