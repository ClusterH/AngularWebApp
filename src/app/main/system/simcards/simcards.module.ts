import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { SimcardsComponent } from 'app/main/system/simcards/simcards/simcards.component';
import { SimcardsService } from 'app/main/system/simcards/services/simcards.service';
import { SimcardDetailComponent } from 'app/main/system/simcards/simcard_detail/simcard_detail.component';
import { SimcardDetailService } from 'app/main/system/simcards/services/simcard_detail.service';
import { CourseDialogComponent } from 'app/main/system/simcards/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'simcards', component: SimcardsComponent },
    { path: 'simcard_detail', component: SimcardDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        SimcardsComponent,
        SimcardDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        SimcardsService, SimcardDetailService
    ]
})
export class SimcardsModule { }