import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PoisService } from 'app/main/admin/poi/pois/services/pois.service';

import { locale as poisEnglish } from 'app/main/admin/poi/pois/i18n/en';
import { locale as poisSpanish } from 'app/main/admin/poi/pois/i18n/sp';
import { locale as poisFrench } from 'app/main/admin/poi/pois/i18n/fr';
import { locale as poisPortuguese } from 'app/main/admin/poi/pois/i18n/pt';

@Component({
    selector: 'poi-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   poi: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private poisService: PoisService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {poi, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(poisEnglish, poisSpanish, poisFrench, poisPortuguese);

        this.poi = poi;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.poi.id = 0;
            this.poi.name = '';
            this.poi.created = '';
            this.poi.createdbyname = '';
            this.poi.deletedwhen = '';
            this.poi.deletedbyname = '';
            this.poi.lastmodifieddate = '';
            this.poi.lastmodifiedbyname = '';
    
            localStorage.setItem("poi_detail", JSON.stringify(this.poi));
            this.router.navigate(['admin/poi/pois/poi_detail']);
        } else if( this.flag == "delete") {
           
            this.poisService.deletePoi(this.poi.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.dialogRef.close(result);
                }
            });
        }
    }

    close() {
        localStorage.removeItem("poi_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("poi_detail");

        this.router.navigate(['admin/poi/pois/pois']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/poi/pois/pois']);
    }

}
