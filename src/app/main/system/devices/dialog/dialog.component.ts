import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DevicesService } from 'app/main/system/devices/services/devices.service';

import { locale as devicesEnglish } from 'app/main/system/devices/i18n/en';
import { locale as devicesSpanish } from 'app/main/system/devices/i18n/sp';
import { locale as devicesFrench } from 'app/main/system/devices/i18n/fr';
import { locale as devicesPortuguese } from 'app/main/system/devices/i18n/pt';

@Component({
    selector: 'device-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   device: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private devicesService: DevicesService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {device, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(devicesEnglish, devicesSpanish, devicesFrench, devicesPortuguese);

        this.device = device;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.device.id = 0;
            this.device.name = '';
            this.device.imei = '';
            this.device.serialnumber = '';
            this.device.created = '';
            this.device.createdbyname = '';
            this.device.deletedwhen = '';
            this.device.deletedbyname = '';
            this.device.lastmodifieddate = '';
            this.device.lastmodifiedbyname = '';
    
            localStorage.setItem("device_detail", JSON.stringify(this.device));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("device_detail")));
    
            this.router.navigate(['system/devices/device_detail']);
        } else if( this.flag == "delete") {
           
            this.devicesService.deleteDevice(this.device.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();

    }

    close() {
        localStorage.removeItem("device_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("device_detail");

        this.router.navigate(['system/devices/devices']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/devices/devices']);
    }

}
