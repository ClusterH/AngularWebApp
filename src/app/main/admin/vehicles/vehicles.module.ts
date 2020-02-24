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
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';

import { VehiclesComponent} from 'app/main/admin/vehicles/vehicles/vehicles.component';
import { VehicleDetailComponent} from 'app/main/admin/vehicles/vehicle_detail/vehicle_detail.component';
import { VehicleDetailService } from 'app/main/admin/vehicles/vehicle_detail/vehicle_detail.service';

const routes: Routes = [
    {
        path     : 'vehicles',
        component: VehiclesComponent 
    },
    {
        path     : 'vehicles/:id',
        component: VehicleDetailComponent,
        resolve  : {
            data: VehicleDetailService
        } 
    },
    {
        path     : 'vehicles/:id/:handle',
        component: VehicleDetailComponent,
        resolve  : {
            data: VehicleDetailService
        }
    },
    
   
    // {
    //     path        : 'osm',
    //     loadChildren: () => import('./osm/osm.module').then(m => m.OpenStreetMapModule)
    // },
];

@NgModule({
    imports     : [
        FuseSharedModule,
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
    ],
    providers: [
        VehicleDetailService
    ]
})
export class VehiclesModule
{
}
