import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'tanks', loadChildren: () => import('./tanks/tanks.module').then(m => m.TanksModule) },
    {
        path: 'fuelregistries', loadChildren: () => import('./fuelregistries/fuelregistries.module').then(m => m.FuelregistriesModule)
    },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class FuelmanagementModule { }