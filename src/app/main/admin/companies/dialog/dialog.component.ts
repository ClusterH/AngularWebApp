import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as companiesEnglish } from 'app/main/admin/companies/i18n/en';
import { locale as companiesFrench } from 'app/main/admin/companies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/companies/i18n/pt';
import { locale as companiesSpanish } from 'app/main/admin/companies/i18n/sp';
import { CompaniesService } from 'app/main/admin/companies/services/companies.service';

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
        @Inject(MAT_DIALOG_DATA) { company, flag }
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
