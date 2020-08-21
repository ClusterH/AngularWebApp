import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { FuseSharedModule } from '@fuse/shared.module';
// import { HttpConfigInterceptor } from 'app/interceptors/https.interceptor';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsDashboardModule) },
    { path: 'google', loadChildren: () => import('./maps/google/google-maps.module').then(m => m.GoogleMapsModule) },
    { path: 'osm', loadChildren: () => import('./maps/osm/osm.module').then(m => m.OpenStreetMapModule) },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // FuseSharedModule,
        SharedModule
    ]
})
export class HomeModule { }