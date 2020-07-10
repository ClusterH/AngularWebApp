import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from 'app/main/home/maps/sidebar/sidebar.module';
// import { QuickPanelModule } from 'app/main/home/maps/quick-panel/quick-panel.module'

const routes = [
    {
        path        : 'analytics',
        loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsDashboardModule)
    },
    {
        path        : 'google',
        loadChildren: () => import('./maps/google/google-maps.module').then(m => m.GoogleMapsModule)
    },
    {
        path        : 'osm',
        loadChildren: () => import('./maps/osm/osm.module').then(m => m.OpenStreetMapModule)
    },
   
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseSidebarModule,
        // QuickPanelModule
    ]
})
export class AppsModule
{
}
