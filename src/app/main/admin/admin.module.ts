import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'vehicles',
        loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule)
    },
    {
        path        : 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
        path        : 'operators',
        loadChildren: () => import('./operators/operators.module').then(m => m.OperatorsModule)
    },
    {
        path        : 'makes',
        loadChildren: () => import('./makes/makes.module').then(m => m.MakesModule)
    },
    {
        path        : 'models',
        loadChildren: () => import('./models/models.module').then(m => m.ModelsModule)
    },
    {
        path        : 'companies',
        loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule)
    },
    {
        path        : 'serviceplans',
        loadChildren: () => import('./serviceplans/serviceplans.module').then(m => m.ServiceplansModule)
    },
    {
        path        : 'unittypes',
        loadChildren: () => import('./unittypes/unittypes.module').then(m => m.UnitTypesModule)
    },


];

@NgModule({
    imports     : [
        FuseSharedModule,
        RouterModule.forChild(routes),
    ]
})
export class AdminModule{ }
