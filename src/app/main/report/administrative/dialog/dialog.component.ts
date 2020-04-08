import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AdministrativeService } from 'app/main/report/administrative/services/administrative.service';

import { locale as administrativeEnglish } from 'app/main/report/administrative/i18n/en';
import { locale as administrativeSpanish } from 'app/main/report/administrative/i18n/sp';
import { locale as administrativeFrench } from 'app/main/report/administrative/i18n/fr';
import { locale as administrativePortuguese } from 'app/main/report/administrative/i18n/pt';

@Component({
    selector: 'administrative-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   vehicle: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private administrativeService: AdministrativeService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {vehicle, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(administrativeEnglish, administrativeSpanish, administrativeFrench, administrativePortuguese);

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
    
        //     this.router.navigate(['admin/administrative/vehicle_detail']);
        // } else if( this.flag == "delete") {
           
        //     this.administrativeService.deleteVehicle(this.vehicle.id)
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

        // this.router.navigate(['admin/administrative/administrative']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/administrative/administrative']);
    }

}
