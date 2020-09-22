import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as dealercompaniesEnglish } from 'app/main/admin/dealercompanies/i18n/en';
import { locale as dealercompaniesFrench } from 'app/main/admin/dealercompanies/i18n/fr';
import { locale as dealercompaniesPortuguese } from 'app/main/admin/dealercompanies/i18n/pt';
import { locale as dealercompaniesSpanish } from 'app/main/admin/dealercompanies/i18n/sp';
import { DealercompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'dealercompany-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    dealercompany: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private dealercompaniesService: DealercompaniesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { dealercompany, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(dealercompaniesEnglish, dealercompaniesSpanish, dealercompaniesFrench, dealercompaniesPortuguese);
        this.dealercompany = dealercompany;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.dealercompany.id = 0;
            this.dealercompany.name = '';
            this.dealercompany.created = '';
            this.dealercompany.createdbyname = '';
            this.dealercompany.deletedwhen = '';
            this.dealercompany.deletedbyname = '';
            this.dealercompany.lastmodifieddate = '';
            this.dealercompany.lastmodifiedbyname = '';
            this.dialogRef.close(this.dealercompany);
        } else if (this.flag == "delete") {
            this.dealercompaniesService.deleteDealercompany(this.dealercompany.id).pipe(takeUntil(this._unsubscribeAll))
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