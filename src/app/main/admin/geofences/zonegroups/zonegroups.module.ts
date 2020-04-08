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
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';


import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseHighlightModule } from '@fuse/components';

import { ZonegroupsComponent} from 'app/main/admin/geofences/zonegroups/zonegroups/zonegroups.component';
import { ZonegroupsService } from 'app/main/admin/geofences/zonegroups/services/zonegroups.service';
import { ZonegroupDetailComponent} from 'app/main/admin/geofences/zonegroups/zonegroup_detail/zonegroup_detail.component';
import { ZonegroupDetailService } from 'app/main/admin/geofences/zonegroups/services/zonegroup_detail.service';
import { CourseDialogComponent } from 'app/main/admin/geofences/zonegroups/dialog/dialog.component';

import { HttpClientModule } from '@angular/common/http';

const routes = [
    {
        path     : 'zonegroups',
        component: ZonegroupsComponent,
        // pathMatch: 'full'
    },
    {
        path     : 'zonegroup_detail',
        component: ZonegroupDetailComponent,
    },
];

@NgModule({
    imports     : [
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseHighlightModule,
        FuseSidebarModule,

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
        MatMenuModule,
        MatListModule,

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
        ZonegroupsComponent,
        ZonegroupDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        ZonegroupsService, ZonegroupDetailService
    ]
})
export class ZonegroupsModule{ }
