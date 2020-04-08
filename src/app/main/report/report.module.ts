import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'administrative',
        loadChildren: () => import('./administrative/administrative.module').then(m => m.AdministrativeModule)
    },
    {
        path        : 'locationhistory',
        loadChildren: () => import('./locationhistory/locationhistory.module').then(m => m.LocationHistoryModule)
    },
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class ReportModule
{
}
