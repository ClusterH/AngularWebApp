import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'pendings',
        loadChildren: () => import('./maintenance/pendings/pendings.module').then(m => m.PendingsModule)
    },
    {
        path        : 'events',
        loadChildren: () => import('./maintenance/events/events.module').then(m => m.EventsModule)
    },
   
    {
        path        : 'serviceitems',
        loadChildren: () => import('./maintenance/serviceitems/serviceitems.module').then(m => m.ServiceitemsModule)
    },
    // {
    //     path        : 'services',
    //     loadChildren: () => import('./services/services.module').then(m => m.ServicesModule)
    // },
    // {
    //     path        : 'history',
    //     loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)
    // },
];

@NgModule({
    imports     : [
        FuseSharedModule,
        RouterModule.forChild(routes),
    ]
})
export class LogisticModule{ }
