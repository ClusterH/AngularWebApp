import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as insurancecompaniesEnglish } from 'app/main/admin/insurancecompanies/i18n/en';
import { locale as insurancecompaniesFrench } from 'app/main/admin/insurancecompanies/i18n/fr';
import { locale as insurancecompaniesPortuguese } from 'app/main/admin/insurancecompanies/i18n/pt';
import { locale as insurancecompaniesSpanish } from 'app/main/admin/insurancecompanies/i18n/sp';
import { InsurancecompaniesService } from 'app/main/admin/insurancecompanies/services/insurancecompanies.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'insurancecompany-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    insurancecompany: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private insurancecompaniesService: InsurancecompaniesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { insurancecompany, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(insurancecompaniesEnglish, insurancecompaniesSpanish, insurancecompaniesFrench, insurancecompaniesPortuguese);
        this.insurancecompany = insurancecompany;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.insurancecompany.id = 0;
            this.insurancecompany.name = '';
            this.insurancecompany.created = '';
            this.insurancecompany.createdbyname = '';
            this.insurancecompany.deletedwhen = '';
            this.insurancecompany.deletedbyname = '';
            this.insurancecompany.lastmodifieddate = '';
            this.insurancecompany.lastmodifiedbyname = '';
            this.dialogRef.close(this.insurancecompany);
        } else if (this.flag == "delete") {
            this.insurancecompaniesService.deleteInsurancecompany(this.insurancecompany.id).pipe(takeUntil(this._unsubscribeAll))
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