import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'tanks',
        loadChildren: () => import('./tanks/tanks.module').then(m => m.TanksModule)
    },

    {
        path        : 'fuelregistries',
        loadChildren: () => import('./fuelregistries/fuelregistries.module').then(m => m.FuelregistriesModule)
    },
   
];

@NgModule({
    imports     : [
        FuseSharedModule,
        RouterModule.forChild(routes),
    ]
})
export class FuelmanagementModule{ }
