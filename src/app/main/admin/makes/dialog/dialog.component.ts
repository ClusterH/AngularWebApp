import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MakesService } from 'app/main/admin/makes/services/makes.service';
import { locale as makesEnglish } from 'app/main/admin/makes/i18n/en';
import { locale as makesSpanish } from 'app/main/admin/makes/i18n/sp';
import { locale as makesFrench } from 'app/main/admin/makes/i18n/fr';
import { locale as makesPortuguese } from 'app/main/admin/makes/i18n/pt';

@Component({
    selector: 'make-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   make: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private makesService: MakesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {make, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(makesEnglish, makesSpanish, makesFrench, makesPortuguese);

        this.make = make;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.make.id = 0;
            this.make.name = '';
            this.make.createdwhen = '';
            this.make.createdbyname = '';
            this.make.lastmodifieddate = '';
            this.make.lastmodifiedbyname = '';
    
            localStorage.setItem("make_detail", JSON.stringify(this.make));
    
            this.router.navigate(['admin/makes/make_detail']);
        } else if( this.flag == "delete") {
            this.makesService.deleteMake(this.make.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.dialogRef.close(result);
                }
            });
        }

    }

    close() {
        localStorage.removeItem("make_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("make_detail");

        this.router.navigate(['admin/makes/makes']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/makes/makes']);
    }

}
