import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CompaniesComponent } from 'app/main/admin/companies/companies/companies.component';
import { CompanyDetailComponent } from 'app/main/admin/companies/company_detail/company_detail.component';
import { CourseDialogComponent } from 'app/main/admin/companies/dialog/dialog.component';
import { CompaniesService } from 'app/main/admin/companies/services/companies.service';
import { CompanyDetailService } from 'app/main/admin/companies/services/company_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'companies/:type', component: CompaniesComponent },
    { path: 'company_detail/:type', component: CompanyDetailComponent }
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        CompaniesComponent,
        CompanyDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        CompaniesService, CompanyDetailService
    ]
})
export class CompaniesModule { }
