import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountsService } from 'app/main/system/accounts/services/accounts.service';
import { locale as accountsEnglish } from 'app/main/system/accounts/i18n/en';
import { locale as accountsSpanish } from 'app/main/system/accounts/i18n/sp';
import { locale as accountsFrench } from 'app/main/system/accounts/i18n/fr';
import { locale as accountsPortuguese } from 'app/main/system/accounts/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'account-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    account: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private accountsService: AccountsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { account, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(accountsEnglish, accountsSpanish, accountsFrench, accountsPortuguese);
        this.account = account;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.account.id = 0;
            this.account.name = '';
            this.account.email = '';
            this.account.phonenumber = '';
            this.account.address = '';
            this.account.contactname = '';
            this.account.created = '';
            this.account.createdbyname = '';
            this.account.deletedwhen = '';
            this.account.deletedbyname = '';
            this.account.lastmodifieddate = '';
            this.account.lastmodifiedbyname = '';
            this.dialogRef.close(this.account);
        } else if (this.flag == "delete") {
            this.accountsService.deleteAccount(this.account.id).pipe(takeUntil(this._unsubscribeAll))
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