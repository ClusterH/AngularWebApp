import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { DealerCompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as companiesEnglish } from 'app/main/admin/dealercompanies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/dealercompanies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/dealercompanies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/dealercompanies/i18n/pt';



@Component({
    selector: 'dealercompany-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   dealercompany: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminDealerCompaniesService: DealerCompaniesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {dealercompany, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

        // this.dealercompany = dealercompany;
        this.dealercompany = dealercompany;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminDealerCompaniesService.duplicateDealerCompany(this.dealercompany);
        // } else if( this.flag == "delete") {
        //     this._adminDealerCompaniesService.deleteDealerCompany(this.dealercompany);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/dealercompanies/dealercompanies']);
    }

}
