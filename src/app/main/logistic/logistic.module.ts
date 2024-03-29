import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'pendings', loadChildren: () => import('./maintenance/pendings/pendings.module').then(m => m.PendingsModule) },
    { path: 'events', loadChildren: () => import('./maintenance/events/events.module').then(m => m.EventsModule) },
    { path: 'serviceitems', loadChildren: () => import('./maintenance/serviceitems/serviceitems.module').then(m => m.ServiceitemsModule) },
    { path: 'maintservices', loadChildren: () => import('./maintenance/maintservices/maintservices.module').then(m => m.MaintservicesModule) },
    { path: 'history', loadChildren: () => import('./maintenance/history/history.module').then(m => m.HistoryModule) },
    { path: 'scrumboard', loadChildren: () => import('./jobmanagement/scrumboard/scrumboard.module').then(m => m.ScrumboardModule) },
    { path: 'routecenter', loadChildren: () => import('./routecenter/routecenter.module').then(m => m.RouteCenterModule) },
    { path: 'routeplanning', loadChildren: () => import('./routeplanning/routeplanning.module').then(m => m.RoutePlanningModule) },
    { path: 'monitor', loadChildren: () => import('./monitor/monitor.module').then(m => m.MonitorModule) },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class LogisticModule { }