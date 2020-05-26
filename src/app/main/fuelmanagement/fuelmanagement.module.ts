import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'tanks',
        loadChildren: () => import('./tanks/tanks.module').then(m => m.TanksModule)
    },
    // {
    //     path        : 'serviceitems',
    //     loadChildren: () => import('./maintenance/serviceitems/serviceitems.module').then(m => m.ServiceitemsModule)
    // },
    // {
    //     path        : 'maintservices',
    //     loadChildren: () => import('./maintenance/maintservices/maintservices.module').then(m => m.MaintservicesModule)
    // },
    // {
    //     path        : 'history',
    //     loadChildren: () => import('./maintenance/history/history.module').then(m => m.HistoryModule)
    // },
];

@NgModule({
    imports     : [
        FuseSharedModule,
        RouterModule.forChild(routes),
    ]
})
export class FuelmanagementModule{ }
