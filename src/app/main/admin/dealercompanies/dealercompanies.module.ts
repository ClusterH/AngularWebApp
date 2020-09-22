import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DealercompaniesComponent } from 'app/main/admin/dealercompanies/dealercompanies/dealercompanies.component';
import { DealercompanyDetailComponent } from 'app/main/admin/dealercompanies/dealercompany_detail/dealercompany_detail.component';
import { CourseDialogComponent } from 'app/main/admin/dealercompanies/dialog/dialog.component';
import { DealercompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { DealercompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'dealercompanies', component: DealercompaniesComponent },
    { path: 'dealercompany_detail', component: DealercompanyDetailComponent }
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        DealercompaniesComponent,
        DealercompanyDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        DealercompaniesService, DealercompanyDetailService
    ]
})
export class DealercompaniesModule { }
