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
    {
        path        : 'maintservices',
        loadChildren: () => import('./maintenance/maintservices/maintservices.module').then(m => m.MaintservicesModule)
    },
    {
        path        : 'history',
        loadChildren: () => import('./maintenance/history/history.module').then(m => m.HistoryModule)
    },
    {
        path        : 'todo',
        loadChildren: () => import('./jobmanagement/todo/todo.module').then(m => m.TodoModule)
    },
    {
        path        : 'scrumboard',
        loadChildren: () => import('./jobmanagement/scrumboard/scrumboard.module').then(m => m.ScrumboardModule)
    },
];

@NgModule({
    imports     : [
        FuseSharedModule,
        RouterModule.forChild(routes),
    ]
})
export class LogisticModule{ }
