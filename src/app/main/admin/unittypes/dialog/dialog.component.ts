import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { UnittypesService } from 'app/main/admin/unittypes/services/unittypes.service';

import { locale as unittypesEnglish } from 'app/main/admin/unittypes/i18n/en';
import { locale as unittypesSpanish } from 'app/main/admin/unittypes/i18n/sp';
import { locale as unittypesFrench } from 'app/main/admin/unittypes/i18n/fr';
import { locale as unittypesPortuguese } from 'app/main/admin/unittypes/i18n/pt';

@Component({
    selector: 'unittype-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   unittype: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private unittypesService: UnittypesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {unittype, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(unittypesEnglish, unittypesSpanish, unittypesFrench, unittypesPortuguese);

        this.unittype = unittype;
        this.flag = flag;
        console.log(this.unittype);
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.unittype.id = 0;
            this.unittype.name = '';
            this.unittype.created = '';
            this.unittype.createdbyname = '';
            this.unittype.deletedwhen = '';
            this.unittype.deletedbyname = '';
            this.unittype.lastmodifieddate = '';
            this.unittype.lastmodifiedbyname = '';
    
            localStorage.setItem("unittype_detail", JSON.stringify(this.unittype));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("unittype_detail")));
    
            this.router.navigate(['admin/unittypes/unittype_detail']);
        } else if( this.flag == "delete") {
            this.unittypesService.deleteUnittype(this.unittype.id)
            .subscribe((result: any) => {
                if (result.responseCode == 200) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("unittype_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("unittype_detail");

        this.router.navigate(['admin/unittypes/unittypes']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/unittypes/unittypes']);
    }

}
