import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';

import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';

@Component({
    selector: 'serviceitem-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   serviceitem: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private serviceitemsService: ServiceitemsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {serviceitem, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);

        this.serviceitem = serviceitem;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.serviceitem.id = 0;
            this.serviceitem.name = '';
            this.serviceitem.email = '';
            this.serviceitem.password = '';
            this.serviceitem.created = '';
            this.serviceitem.createdbyname = '';
            this.serviceitem.deletedwhen = '';
            this.serviceitem.deletedbyname = '';
            this.serviceitem.lastmodifieddate = '';
            this.serviceitem.lastmodifiedbyname = '';
    
            localStorage.setItem("serviceitem_detail", JSON.stringify(this.serviceitem));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("serviceitem_detail")));
    
            this.router.navigate(['logistic/serviceitems/serviceitem_detail']);
        } else if( this.flag == "delete") {
            this.serviceitemsService.deleteServiceitem(this.serviceitem.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    // this.reloadComponent();
                }
              });
        }


        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("serviceitem_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("serviceitem_detail");

        this.router.navigate(['logistic/serviceitems/serviceitems']);
    }

    // reloadComponent() {
    //     this.router.routeReuseStrategy.shouldReserviceitemoute = () => false;
    //     this.router.onSameUrlNavigation = 'reload';
    //     this.router.navigate(['logistic/serviceitems/serviceitems']);
    // }

}
