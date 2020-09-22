import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { ModelsComponent } from 'app/main/admin/models/models/models.component';
import { ModelsService } from 'app/main/admin/models/services/models.service';
import { ModelDetailComponent } from 'app/main/admin/models/model_detail/model_detail.component';
import { ModelDetailService } from 'app/main/admin/models/services/model_detail.service';
import { CourseDialogComponent } from 'app/main/admin/models/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'models', component: ModelsComponent },
    { path: 'model_detail', component: ModelDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ModelsComponent,
        ModelDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ModelsService, ModelDetailService
    ]
})
export class ModelsModule { }