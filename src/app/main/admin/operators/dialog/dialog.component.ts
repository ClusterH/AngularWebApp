import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as operatorsEnglish } from 'app/main/admin/operators/i18n/en';
import { locale as operatorsSpanish } from 'app/main/admin/operators/i18n/sp';
import { locale as operatorsFrench } from 'app/main/admin/operators/i18n/fr';
import { locale as operatorsPortuguese } from 'app/main/admin/operators/i18n/pt';

@Component({
    selector: 'operator-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   operator: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {operator, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(operatorsEnglish, operatorsSpanish, operatorsFrench, operatorsPortuguese);

        this.operator = operator;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.operator.id = 0;
            this.operator.name = '';
            this.operator.email = '';
            this.operator.password = '';
            this.operator.phonenumber = '';
            this.operator.created = '';
            this.operator.createdbyname = '';
            this.operator.deletedwhen = '';
            this.operator.deletedbyname = '';
            this.operator.lastmodifieddate = '';
            this.operator.lastmodifiedbyname = '';
    
            localStorage.setItem("operator_detail", JSON.stringify(this.operator));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("operator_detail")));
    
            this.router.navigate(['admin/operators/operator_detail']);
        } else if( this.flag == "delete") {
            // this._adminOperatorsService.deleteOperator(this.operator);
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("operator_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("operator_detail");

        this.router.navigate(['admin/operators/operators']);
    }

}
