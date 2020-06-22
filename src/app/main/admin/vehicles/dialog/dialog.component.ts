import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';

import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';

@Component({
    selector: 'vehicle-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   vehicle: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private vehiclesService: VehiclesService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {vehicle, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

        this.vehicle = vehicle;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.vehicle.id = 0;
            this.vehicle.name = '';
            this.vehicle.created = '';
            this.vehicle.createdbyname = '';
            this.vehicle.deletedwhen = '';
            this.vehicle.deletedbyname = '';
            this.vehicle.lastmodifieddate = '';
            this.vehicle.lastmodifiedbyname = '';
    
            localStorage.setItem("vehicle_detail", JSON.stringify(this.vehicle));
    
            
    
            this.router.navigate(['admin/vehicles/vehicle_detail']);
        } else if( this.flag == "delete") {
           
            this.vehiclesService.deleteVehicle(this.vehicle.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();

    }

    close() {
        localStorage.removeItem("vehicle_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("vehicle_detail");

        this.router.navigate(['admin/vehicles/vehicles']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/vehicles/vehicles']);
    }

}
