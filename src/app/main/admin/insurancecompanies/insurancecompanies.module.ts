import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InsurancecompaniesComponent } from 'app/main/admin/insurancecompanies/insurancecompanies/insurancecompanies.component';
import { InsurancecompanyDetailComponent } from 'app/main/admin/insurancecompanies/insurancecompany_detail/insurancecompany_detail.component';
import { CourseDialogComponent } from 'app/main/admin/insurancecompanies/dialog/dialog.component';
import { InsurancecompaniesService } from 'app/main/admin/insurancecompanies/services/insurancecompanies.service';
import { InsurancecompanyDetailService } from 'app/main/admin/insurancecompanies/services/insurancecompany_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'insurancecompanies', component: InsurancecompaniesComponent },
    { path: 'insurancecompany_detail', component: InsurancecompanyDetailComponent }
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        InsurancecompaniesComponent,
        InsurancecompanyDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        InsurancecompaniesService, InsurancecompanyDetailService
    ]
})
export class InsurancecompaniesModule { }
