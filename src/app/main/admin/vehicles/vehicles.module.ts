import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
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

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { VehiclesComponent} from 'app/main/admin/vehicles/vehicles/vehicles.component';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import { VehicleDetailComponent} from 'app/main/admin/vehicles/vehicle_detail/vehicle_detail.component';
import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { CourseDialogComponent } from 'app/main/admin/vehicles/dialog/dialog.component';
import { StylePaginatorDirective } from 'app/main/admin/vehicles/vehicles/style-paginator.directive';

import { HttpClientModule } from '@angular/common/http';

const routes = [
    {
        path     : 'vehicles',
        component: VehiclesComponent,
        // pathMatch: 'full'
    },
    {
        path     : 'vehicle_detail',
        component: VehicleDetailComponent,
        // pathMatch: 'full'
    },
];

@NgModule({
    imports     : [
        FuseSharedModule,
        FuseConfirmDialogModule,
        NgxDatatableModule,
        
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

        NgbModule,
        CommonModule,
        UiSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        VehiclesComponent,
        VehicleDetailComponent,
        CourseDialogComponent,
        StylePaginatorDirective
    ],
    providers: [
        VehiclesService, VehicleDetailService
    ]
})
export class VehiclesModule{ }
