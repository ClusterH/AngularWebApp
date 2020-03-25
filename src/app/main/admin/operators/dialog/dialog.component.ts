import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { OperatorsService } from 'app/main/admin/operators/services/operators.service';
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
        private fb: FormBuilder,
        private router: Router,
        private _adminOperatorsService: OperatorsService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {operator, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(operatorsEnglish, operatorsSpanish, operatorsFrench, operatorsPortuguese);

        // this.operator = operator;
        this.operator = operator;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminOperatorsService.duplicateOperator(this.operator);
        // } else if( this.flag == "delete") {
        //     this._adminOperatorsService.deleteOperator(this.operator);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/operators/operators']);
    }

}
