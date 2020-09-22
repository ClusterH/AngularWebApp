import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/assets/dialog/dialog.component';
import { AssetsService } from 'app/main/admin/assets/services/assets.service';
import { AssetDetailService } from 'app/main/admin/assets/services/asset_detail.service';
import { AssetsComponent } from 'app/main/admin/assets/assets/assets.component';
import { AssetDetailComponent } from 'app/main/admin/assets/asset_detail/asset_detail.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'assets', component: AssetsComponent },
    { path: 'asset_detail', component: AssetDetailComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MatDialogModule,
        TranslateModule,
        SharedModule
    ],
    declarations: [
        AssetsComponent,
        AssetDetailComponent,
        CourseDialogComponent,
    ],
    providers: [AssetsService, AssetDetailService]
})
export class AssetsModule { }