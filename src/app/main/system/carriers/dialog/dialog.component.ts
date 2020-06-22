import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { CarriersService } from 'app/main/system/carriers/services/carriers.service';

import { locale as carriersEnglish } from 'app/main/system/carriers/i18n/en';
import { locale as carriersSpanish } from 'app/main/system/carriers/i18n/sp';
import { locale as carriersFrench } from 'app/main/system/carriers/i18n/fr';
import { locale as carriersPortuguese } from 'app/main/system/carriers/i18n/pt';

@Component({
    selector: 'carrier-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   carrier: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private carriersService: CarriersService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {carrier, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(carriersEnglish, carriersSpanish, carriersFrench, carriersPortuguese);

        this.carrier = carrier;
        this.flag = flag;
        
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.carrier.id = 0;
            this.carrier.name = '';
            this.carrier.created = '';
            this.carrier.createdbyname = '';
            this.carrier.deletedwhen = '';
            this.carrier.deletedbyname = '';
            this.carrier.lastmodifieddate = '';
            this.carrier.lastmodifiedbyname = '';
    
            localStorage.setItem("carrier_detail", JSON.stringify(this.carrier));
    
            
    
            this.router.navigate(['system/carriers/carrier_detail']);
        } else if( this.flag == "delete") {
            this.carriersService.deleteCarrier(this.carrier.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("carrier_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("carrier_detail");

        this.router.navigate(['system/carriers/carriers']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/carriers/carriers']);
    }

}
