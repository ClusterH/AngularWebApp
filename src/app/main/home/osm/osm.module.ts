import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgmCoreModule } from '@agm/core';
// import { OsmViewComponent } from './osm-view/osm-view.component';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseHighlightModule } from '@fuse/components/index';

import { OpenStreetMapComponent } from './osm.component';

const routes = [
    {
        path     : '**',
        component: OpenStreetMapComponent
    }
];

@NgModule({
    declarations: [
        OpenStreetMapComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatIconModule,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ'
        }),

        FuseSharedModule,
        FuseHighlightModule
    ],
})
export class OpenStreetMapModule
{
}
