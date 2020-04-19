import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ZonegroupsService } from 'app/main/admin/geofences/zonegroups/services/zonegroups.service';

import { locale as zonegroupsEnglish } from 'app/main/admin/geofences/zonegroups/i18n/en';
import { locale as zonegroupsSpanish } from 'app/main/admin/geofences/zonegroups/i18n/sp';
import { locale as zonegroupsFrench } from 'app/main/admin/geofences/zonegroups/i18n/fr';
import { locale as zonegroupsPortuguese } from 'app/main/admin/geofences/zonegroups/i18n/pt';

@Component({
    selector: 'zonegroup-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   zonegroup: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private zonegroupsService: ZonegroupsService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {zonegroup, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(zonegroupsEnglish, zonegroupsSpanish, zonegroupsFrench, zonegroupsPortuguese);

        this.zonegroup = zonegroup;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.zonegroup.id = 0;
            this.zonegroup.name = '';
            this.zonegroup.created = '';
            this.zonegroup.createdbyname = '';
            this.zonegroup.deletedwhen = '';
            this.zonegroup.deletedbyname = '';
            this.zonegroup.lastmodifieddate = '';
            this.zonegroup.lastmodifiedbyname = '';
    
            localStorage.setItem("zonegroup_detail", JSON.stringify(this.zonegroup));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("zonegroup_detail")));
    
            this.router.navigate(['admin/geofences/zonegroups/zonegroup_detail']);
        } else if( this.flag == "delete") {
           
            this.zonegroupsService.deleteZonegroup(this.zonegroup.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();

    }

    close() {
        localStorage.removeItem("zonegroup_detail");
        this.dialogRef.close();
    }

    goback() {
        localStorage.removeItem("zonegroup_detail");

        this.router.navigate(['admin/geofences/zonegroups/zonegroups']);
        this.dialogRef.close();
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/geofences/zonegroups/zonegroups']);
    }

}
