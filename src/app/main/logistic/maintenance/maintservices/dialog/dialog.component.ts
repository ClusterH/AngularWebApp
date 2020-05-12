import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service';

import { locale as maintservicesEnglish } from 'app/main/logistic/maintenance/maintservices/i18n/en';
import { locale as maintservicesSpanish } from 'app/main/logistic/maintenance/maintservices/i18n/sp';
import { locale as maintservicesFrench } from 'app/main/logistic/maintenance/maintservices/i18n/fr';
import { locale as maintservicesPortuguese } from 'app/main/logistic/maintenance/maintservices/i18n/pt';

@Component({
    selector: 'maintservice-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   maintservice: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private maintservicesService: MaintservicesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {maintservice, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(maintservicesEnglish, maintservicesSpanish, maintservicesFrench, maintservicesPortuguese);

        this.maintservice = maintservice;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.maintservice.id = 0;
            this.maintservice.name = '';
            this.maintservice.email = '';
            this.maintservice.password = '';
            this.maintservice.created = '';
            this.maintservice.createdbyname = '';
            this.maintservice.deletedwhen = '';
            this.maintservice.deletedbyname = '';
            this.maintservice.lastmodifieddate = '';
            this.maintservice.lastmodifiedbyname = '';
    
            localStorage.setItem("maintservice_detail", JSON.stringify(this.maintservice));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("maintservice_detail")));
    
            this.router.navigate(['logistic/maintservices/maintservice_detail']);
        } else if( this.flag == "delete") {
            this.maintservicesService.deleteMaintservice(this.maintservice.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    // this.reloadComponent();
                }
              });
        }


        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("maintservice_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("maintservice_detail");

        this.router.navigate(['logistic/maintservices/maintservices']);
    }

    // reloadComponent() {
    //     this.router.routeReuseStrategy.shouldRemaintserviceoute = () => false;
    //     this.router.onSameUrlNavigation = 'reload';
    //     this.router.navigate(['logistic/maintservices/maintservices']);
    // }

}
