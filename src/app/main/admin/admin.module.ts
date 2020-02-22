import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesComponent} from './vehicles/vehicles.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule , ReactiveFormsModule, } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

import { FuseSharedModule } from '@fuse/shared.module';


const routes = [
    {
        path     : 'vehicles',
        component: VehiclesComponent 
    },
    // {
    //     path        : 'google',
    //     loadChildren: () => import('./google/google-maps.module').then(m => m.GoogleMapsModule)
    // },
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
        NgbModule,
        CommonModule,
        UiSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        VehiclesComponent
    ],
})
export class AdminModule
{
}
