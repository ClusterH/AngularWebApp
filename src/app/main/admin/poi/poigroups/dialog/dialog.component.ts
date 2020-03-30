import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PoigroupsService } from 'app/main/admin/poi/poigroups/services/poigroups.service';

import { locale as poigroupsEnglish } from 'app/main/admin/poi/poigroups/i18n/en';
import { locale as poigroupsSpanish } from 'app/main/admin/poi/poigroups/i18n/sp';
import { locale as poigroupsFrench } from 'app/main/admin/poi/poigroups/i18n/fr';
import { locale as poigroupsPortuguese } from 'app/main/admin/poi/poigroups/i18n/pt';

@Component({
    selector: 'poigroup-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   poigroup: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private poigroupsService: PoigroupsService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {poigroup, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(poigroupsEnglish, poigroupsSpanish, poigroupsFrench, poigroupsPortuguese);

        this.poigroup = poigroup;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.poigroup.id = 0;
            this.poigroup.name = '';
            this.poigroup.created = '';
            this.poigroup.createdbyname = '';
            this.poigroup.deletedwhen = '';
            this.poigroup.deletedbyname = '';
            this.poigroup.lastmodifieddate = '';
            this.poigroup.lastmodifiedbyname = '';
    
            localStorage.setItem("poigroup_detail", JSON.stringify(this.poigroup));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("poigroup_detail")));
    
            this.router.navigate(['admin/poi/poigroups/poigroup_detail']);
        } else if( this.flag == "delete") {
           
            this.poigroupsService.deletePoigroup(this.poigroup.id)
            .subscribe((result: any) => {
                if (result.responseCode == 200) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();

    }

    close() {
        localStorage.removeItem("poigroup_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("poigroup_detail");

        this.router.navigate(['admin/poi/poigroups/poigroups']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/poi/poigroups/poigroups']);
    }

}
