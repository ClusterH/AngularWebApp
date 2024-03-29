import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsDashboardModule) },
    { path: 'google/:type', loadChildren: () => import('./maps/google/google-maps.module').then(m => m.GoogleMapsModule) },
    { path: 'osm', loadChildren: () => import('./maps/osm/osm.module').then(m => m.OpenStreetMapModule) },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: []
})
export class HomeModule { }