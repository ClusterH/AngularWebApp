import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'serviceplans', loadChildren: () => import('./serviceplans/serviceplans.module').then(m => m.ServiceplansModule) },
    { path: 'unittypes', loadChildren: () => import('./unittypes/unittypes.module').then(m => m.UnitTypesModule) },
    { path: 'accounts', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule) },
    { path: 'carriers', loadChildren: () => import('./carriers/carriers.module').then(m => m.CarriersModule) },
    { path: 'simcards', loadChildren: () => import('./simcards/simcards.module').then(m => m.SimcardsModule) },
    { path: 'devices', loadChildren: () => import('./devices/devices.module').then(m => m.DevicesModule) },
    { path: 'connections', loadChildren: () => import('./connections/connections.module').then(m => m.ConnectionsModule) },
    { path: 'userprofiles', loadChildren: () => import('./userprofiles/userprofiles.module').then(m => m.UserProfilesModule) },
    { path: 'privileges', loadChildren: () => import('./privileges/privileges.module').then(m => m.PrivilegesModule) },
    { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
    { path: 'devconfigs', loadChildren: () => import('./devconfigs/devconfigs.module').then(m => m.DevConfigsModule) },
    { path: 'syscommands', loadChildren: () => import('./syscommands/syscommands.module').then(m => m.SysCommandsModule) },
    { path: 'commands', loadChildren: () => import('./commands/commands.module').then(m => m.CommandsModule) },
    { path: 'contractors', loadChildren: () => import('./installations/contractors/contractors.module').then(m => m.ContractorsModule) },
    { path: 'installers', loadChildren: () => import('./installations/installers/installers.module').then(m => m.InstallersModule) },
    { path: 'jobs', loadChildren: () => import('./installations/jobs/jobs.module').then(m => m.JobsModule) },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class SystemModule { }