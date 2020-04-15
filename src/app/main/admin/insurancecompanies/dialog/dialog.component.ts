import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { InsuranceCompaniesService } from 'app/main/admin/insurancecompanies/services/insurancecompanies.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as companiesEnglish } from 'app/main/admin/insurancecompanies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/insurancecompanies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/insurancecompanies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/insurancecompanies/i18n/pt';



@Component({
    selector: 'insurancecompany-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   insurancecompany: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminInsuranceCompaniesService: InsuranceCompaniesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {insurancecompany, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

        // this.insurancecompany = insurancecompany;
        this.insurancecompany = insurancecompany;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminInsuranceCompaniesService.duplicateInsuranceCompany(this.insurancecompany);
        // } else if( this.flag == "delete") {
        //     this._adminInsuranceCompaniesService.deleteInsuranceCompany(this.insurancecompany);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
    }

}
