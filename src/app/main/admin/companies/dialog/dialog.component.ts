import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { CompaniesService } from 'app/main/admin/companies/services/companies.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as companiesEnglish } from 'app/main/admin/companies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/companies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/companies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/companies/i18n/pt';



@Component({
    selector: 'company-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   company: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminCompaniesService: CompaniesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {company, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

        // this.company = company;
        this.company = company;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminCompaniesService.duplicateCompany(this.company);
        // } else if( this.flag == "delete") {
        //     this._adminCompaniesService.deleteCompany(this.company);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/companies/companies']);
    }

}
