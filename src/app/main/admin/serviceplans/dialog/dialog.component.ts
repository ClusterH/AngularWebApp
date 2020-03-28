import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ServiceplansService } from 'app/main/admin/serviceplans/services/serviceplans.service';
import { locale as serviceplansEnglish } from 'app/main/admin/serviceplans/i18n/en';
import { locale as serviceplansSpanish } from 'app/main/admin/serviceplans/i18n/sp';
import { locale as serviceplansFrench } from 'app/main/admin/serviceplans/i18n/fr';
import { locale as serviceplansPortuguese } from 'app/main/admin/serviceplans/i18n/pt';

@Component({
    selector: 'serviceplan-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   serviceplan: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private serviceplansService: ServiceplansService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {serviceplan, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(serviceplansEnglish, serviceplansSpanish, serviceplansFrench, serviceplansPortuguese);

        this.serviceplan = serviceplan;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.serviceplan.id = 0;
            this.serviceplan.name = '';
            this.serviceplan.created = '';
            this.serviceplan.createdbyname = '';
            this.serviceplan.deletedwhen = '';
            this.serviceplan.deletedbyname = '';
            this.serviceplan.lastmodifieddate = '';
            this.serviceplan.lastmodifiedbyname = '';
    
            localStorage.setItem("serviceplan_detail", JSON.stringify(this.serviceplan));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("serviceplan_detail")));
    
            this.router.navigate(['admin/serviceplans/serviceplan_detail']);
        } else if( this.flag == "delete") {
            this.serviceplansService.deleteServiceplan(this.serviceplan.id)
            .subscribe((result: any) => {
                if (result.responseCode == 200) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("serviceplan_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("serviceplan_detail");

        this.router.navigate(['admin/serviceplans/serviceplans']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/serviceplans/serviceplans']);
    }

}
