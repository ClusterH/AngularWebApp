import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountsService } from 'app/main/system/accounts/services/accounts.service';

import { locale as accountsEnglish } from 'app/main/system/accounts/i18n/en';
import { locale as accountsSpanish } from 'app/main/system/accounts/i18n/sp';
import { locale as accountsFrench } from 'app/main/system/accounts/i18n/fr';
import { locale as accountsPortuguese } from 'app/main/system/accounts/i18n/pt';

@Component({
    selector: 'account-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   account: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private accountsService: AccountsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {account, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(accountsEnglish, accountsSpanish, accountsFrench, accountsPortuguese);

        this.account = account;
        this.flag = flag;
        
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
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
    
            localStorage.setItem("account_detail", JSON.stringify(this.account));
    
            
    
            this.router.navigate(['system/accounts/account_detail']);
        } else if( this.flag == "delete") {
            this.accountsService.deleteAccount(this.account.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("account_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("account_detail");

        this.router.navigate(['system/accounts/accounts']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/accounts/accounts']);
    }

}
