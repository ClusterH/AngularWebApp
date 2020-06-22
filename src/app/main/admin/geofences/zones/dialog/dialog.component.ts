import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ZonesService } from 'app/main/admin/geofences/zones/services/zones.service';

import { locale as zonesEnglish } from 'app/main/admin/geofences/zones/i18n/en';
import { locale as zonesSpanish } from 'app/main/admin/geofences/zones/i18n/sp';
import { locale as zonesFrench } from 'app/main/admin/geofences/zones/i18n/fr';
import { locale as zonesPortuguese } from 'app/main/admin/geofences/zones/i18n/pt';

@Component({
    selector: 'zone-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   zone: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private zonesService: ZonesService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {zone, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(zonesEnglish, zonesSpanish, zonesFrench, zonesPortuguese);

        this.zone = zone;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.zone.id = 0;
            this.zone.name = '';
            this.zone.created = '';
            this.zone.createdbyname = '';
            this.zone.deletedwhen = '';
            this.zone.deletedbyname = '';
            this.zone.lastmodifieddate = '';
            this.zone.lastmodifiedbyname = '';
    
            localStorage.setItem("zone_detail", JSON.stringify(this.zone));
    
            
    
            this.router.navigate(['admin/geofences/zones/zone_detail']);
        } else if( this.flag == "delete") {
           
            this.zonesService.deleteZone(this.zone.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();

    }

    close() {
        localStorage.removeItem("zone_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("zone_detail");

        this.router.navigate(['admin/geofences/zones/zones']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/geofences/zones/zones']);
    }

}
