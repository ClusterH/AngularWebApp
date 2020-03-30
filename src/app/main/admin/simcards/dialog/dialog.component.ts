import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SimcardsService } from 'app/main/admin/simcards/services/simcards.service';

import { locale as simcardsEnglish } from 'app/main/admin/simcards/i18n/en';
import { locale as simcardsSpanish } from 'app/main/admin/simcards/i18n/sp';
import { locale as simcardsFrench } from 'app/main/admin/simcards/i18n/fr';
import { locale as simcardsPortuguese } from 'app/main/admin/simcards/i18n/pt';

@Component({
    selector: 'simcard-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   simcard: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private simcardsService: SimcardsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {simcard, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(simcardsEnglish, simcardsSpanish, simcardsFrench, simcardsPortuguese);

        this.simcard = simcard;
        this.flag = flag;
        console.log(this.simcard);
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.simcard.id = 0;
            this.simcard.name = '';
            this.simcard.phonenumber = '';
            this.simcard.created = '';
            this.simcard.createdbyname = '';
            this.simcard.deletedwhen = '';
            this.simcard.deletedbyname = '';
            this.simcard.lastmodifieddate = '';
            this.simcard.lastmodifiedbyname = '';
    
            localStorage.setItem("simcard_detail", JSON.stringify(this.simcard));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("simcard_detail")));
    
            this.router.navigate(['admin/simcards/simcard_detail']);
        } else if( this.flag == "delete") {
            this.simcardsService.deleteSimcard(this.simcard.id)
            .subscribe((result: any) => {
                if (result.responseCode == 200) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("simcard_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("simcard_detail");

        this.router.navigate(['admin/simcards/simcards']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/simcards/simcards']);
    }

}
