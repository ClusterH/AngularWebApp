import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SysCommandsService } from 'app/main/system/syscommands/services/syscommands.service';
import { locale as syscommandsEnglish } from 'app/main/system/syscommands/i18n/en';
import { locale as syscommandsSpanish } from 'app/main/system/syscommands/i18n/sp';
import { locale as syscommandsFrench } from 'app/main/system/syscommands/i18n/fr';
import { locale as syscommandsPortuguese } from 'app/main/system/syscommands/i18n/pt';

@Component({
    selector: 'syscommand-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   syscommand: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private syscommandsService: SysCommandsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {syscommand, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(syscommandsEnglish, syscommandsSpanish, syscommandsFrench, syscommandsPortuguese);

        this.syscommand = syscommand;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.syscommand.id = 0;
            this.syscommand.name = '';
            this.syscommand.createdwhen = '';
            this.syscommand.createdbyname = '';
            this.syscommand.lastmodifieddate = '';
            this.syscommand.lastmodifiedbyname = '';
    
            localStorage.setItem("syscommand_detail", JSON.stringify(this.syscommand));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("syscommand_detail")));
    
            this.router.navigate(['system/syscommands/syscommand_detail']);
        } else if( this.flag == "delete") {
            this.syscommandsService.deleteSysCommand(this.syscommand.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("syscommand_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("syscommand_detail");

        this.router.navigate(['system/syscommands/syscommands']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/syscommands/syscommands']);
    }

}
