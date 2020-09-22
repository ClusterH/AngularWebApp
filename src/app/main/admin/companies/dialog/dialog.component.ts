import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as companiesEnglish } from 'app/main/admin/companies/i18n/en';
import { locale as companiesFrench } from 'app/main/admin/companies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/companies/i18n/pt';
import { locale as companiesSpanish } from 'app/main/admin/companies/i18n/sp';
import { CompaniesService } from 'app/main/admin/companies/services/companies.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'company-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    company: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private companiesService: CompaniesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { company, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);
        this.company = company;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.company.id = 0;
            this.company.name = '';
            this.company.created = '';
            this.company.createdbyname = '';
            this.company.deletedwhen = '';
            this.company.deletedbyname = '';
            this.company.lastmodifieddate = '';
            this.company.lastmodifiedbyname = '';
            this.dialogRef.close(this.company);
        } else if (this.flag == "delete") {
            this.companiesService.deleteCompany(this.company.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}