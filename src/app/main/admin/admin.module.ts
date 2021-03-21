import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'vehicles', loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule) },
    { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
    { path: 'operators', loadChildren: () => import('./operators/operators.module').then(m => m.OperatorsModule) },
    { path: 'makes', loadChildren: () => import('./makes/makes.module').then(m => m.MakesModule) },
    { path: 'models', loadChildren: () => import('./models/models.module').then(m => m.ModelsModule) },
    { path: 'companies', loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule) },
    { path: 'poi/pois', loadChildren: () => import('./poi/pois/pois.module').then(m => m.PoisModule) },
    { path: 'poi/poigroups', loadChildren: () => import('./poi/poigroups/poigroups.module').then(m => m.PoigroupsModule) },
    { path: 'geofences/zones', loadChildren: () => import('./geofences/zones/zones.module').then(m => m.ZonesModule) },
    { path: 'geofences/zonegroups', loadChildren: () => import('./geofences/zonegroups/zonegroups.module').then(m => m.ZonegroupsModule) },
    { path: 'groups', loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule) },
    { path: 'routes', loadChildren: () => import('./routes/routes.module').then(m => m.RoutesModule) },
    { path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule) },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class AdminModule { }