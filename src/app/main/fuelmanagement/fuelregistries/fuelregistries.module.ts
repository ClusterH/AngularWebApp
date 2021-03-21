import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { FuelregistriesComponent } from 'app/main/fuelmanagement/fuelregistries/fuelregistries/fuelregistries.component';
import { FuelregistriesService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistries.service';
import { FuelregistryDetailComponent } from 'app/main/fuelmanagement/fuelregistries/fuelregistry_detail/fuelregistry_detail.component';
import { FuelregistryDetailService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistry_detail.service';
import { FuelRegisterDialogComponent } from 'app/main/fuelmanagement/fuelregistries/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'fuelregistries', component: FuelregistriesComponent },
    { path: 'fuelregistry_detail', component: FuelregistryDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        FuelregistriesComponent,
        FuelregistryDetailComponent,
        FuelRegisterDialogComponent,
    ],
    providers: [
        FuelregistriesService, FuelregistryDetailService
    ]
})
export class FuelregistriesModule { }