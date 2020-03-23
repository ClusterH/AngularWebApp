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
];

@NgModule({
    imports     : [
        FuseSharedModule,
        RouterModule.forChild(routes),
    ]
})
export class AdminModule{ }
