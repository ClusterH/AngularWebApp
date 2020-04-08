import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { LocationHistoryService } from 'app/main/report/locationhistory/services/locationhistory.service';

import { locale as locationhistoryEnglish } from 'app/main/report/locationhistory/i18n/en';
import { locale as locationhistorySpanish } from 'app/main/report/locationhistory/i18n/sp';
import { locale as locationhistoryFrench } from 'app/main/report/locationhistory/i18n/fr';
import { locale as locationhistoryPortuguese } from 'app/main/report/locationhistory/i18n/pt';

@Component({
    selector: 'locationhistory-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   vehicle: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private locationhistoryService: LocationHistoryService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {vehicle, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(locationhistoryEnglish, locationhistorySpanish, locationhistoryFrench, locationhistoryPortuguese);

        this.vehicle = vehicle;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        // if(this.flag == "duplicate") {
        
        //     this.vehicle.id = 0;
        //     this.vehicle.name = '';
        //     this.vehicle.created = '';
        //     this.vehicle.createdbyname = '';
        //     this.vehicle.deletedwhen = '';
        //     this.vehicle.deletedbyname = '';
        //     this.vehicle.lastmodifieddate = '';
        //     this.vehicle.lastmodifiedbyname = '';
    
        //     localStorage.setItem("vehicle_detail", JSON.stringify(this.vehicle));
    
        //     console.log("localstorage:", JSON.parse(localStorage.getItem("vehicle_detail")));
    
        //     this.router.navigate(['admin/locationhistory/vehicle_detail']);
        // } else if( this.flag == "delete") {
           
        //     this.locationhistoryService.deleteVehicle(this.vehicle.id)
        //     .subscribe((result: any) => {
        //         if (result.responseCode == 200) {
        //             this.reloadComponent();
        //         }
        //     });
        // }

        this.dialogRef.close();

    }

    close() {
        // localStorage.removeItem("vehicle_detail");
        this.dialogRef.close();
    }

    goback() {
        // this.dialogRef.close();
        // localStorage.removeItem("vehicle_detail");

        // this.router.navigate(['admin/locationhistory/locationhistory']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/locationhistory/locationhistory']);
    }

}
