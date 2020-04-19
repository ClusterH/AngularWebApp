import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DevConfigsService } from 'app/main/system/devconfigs/services/devconfigs.service';
import { locale as devconfigsEnglish } from 'app/main/system/devconfigs/i18n/en';
import { locale as devconfigsSpanish } from 'app/main/system/devconfigs/i18n/sp';
import { locale as devconfigsFrench } from 'app/main/system/devconfigs/i18n/fr';
import { locale as devconfigsPortuguese } from 'app/main/system/devconfigs/i18n/pt';

@Component({
    selector: 'devconfig-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   devconfig: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private devconfigsService: DevConfigsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {devconfig, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(devconfigsEnglish, devconfigsSpanish, devconfigsFrench, devconfigsPortuguese);

        this.devconfig = devconfig;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.devconfig.id = 0;
            this.devconfig.name = '';
            this.devconfig.createdwhen = '';
            this.devconfig.createdbyname = '';
            this.devconfig.lastmodifieddate = '';
            this.devconfig.lastmodifiedbyname = '';
    
            localStorage.setItem("devconfig_detail", JSON.stringify(this.devconfig));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("devconfig_detail")));
    
            this.router.navigate(['system/devconfigs/devconfig_detail']);
        } else if( this.flag == "delete") {
            this.devconfigsService.deleteDevConfig(this.devconfig.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("devconfig_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("devconfig_detail");

        this.router.navigate(['system/devconfigs/devconfigs']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/devconfigs/devconfigs']);
    }

}
