import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as accountsEnglish } from 'app/main/system/accounts/i18n/en';
import { locale as accountsFrench } from 'app/main/system/accounts/i18n/fr';
import { locale as accountsPortuguese } from 'app/main/system/accounts/i18n/pt';
import { locale as accountsSpanish } from 'app/main/system/accounts/i18n/sp';
import { AccountDetail } from 'app/main/system/accounts/model/account.model';
import { AccountDetailDataSource } from "app/main/system/accounts/services/account_detail.datasource";
import { AccountDetailService } from 'app/main/system/accounts/services/account_detail.service';
import { isEmpty, isEqual } from 'lodash';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-account-detail',
    templateUrl: './account_detail.component.html',
    styleUrls: ['./account_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class AccountDetailComponent implements OnInit, OnDestroy {
    account_detail: any;
    public account: any;
    pageType: string;
    userConncode: string;
    userID: number;
    accountModel_flag: boolean;
    accountForm: FormGroup;
    accountDetail: AccountDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: AccountDetailDataSource;
    dataSourceBillingStatus: AccountDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorBillingStatus: MatPaginator;

    constructor(
        public accountDetailService: AccountDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(accountsEnglish, accountsSpanish, accountsFrench, accountsPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.account = data;
        });
        if (isEmpty(this.account)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceBillingStatus = new AccountDetailDataSource(this.accountDetailService);
        this.dataSourceBillingStatus.loadAccountDetail(0, 10, '', "billingstatus_clist");
        this.accountForm = this._formBuilder.group({
            name: [null, Validators.required],
            address: [null, Validators.required],
            phonenumber: [null, Validators.required],
            email: [null, Validators.required],
            contactname: [null, Validators.required],
            billingstatus: [null, Validators.required],
            billingfrequency: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
        });

        this.setValues();
        this.account_detail = this.accountForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorBillingStatus.page)
            .pipe(tap(() => { this.loadAccountDetail("billingstatus") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadAccountDetail(method_string: string) {
        if (method_string == 'billingstatus') {
            this.dataSourceBillingStatus.loadAccountDetail(this.paginatorBillingStatus.pageIndex, this.paginatorBillingStatus.pageSize, "", `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'billingstatus':
                this.paginatorBillingStatus.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.accountForm.get(`${this.method_string}`).value;
        let clist = this.accountDetailService.unit_clist_item[methodString];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadAccountDetail(this.method_string);
    }

    setValues() {
        this.accountForm.get('name').setValue(this.account.name);
        this.accountForm.get('address').setValue(this.account.address);
        this.accountForm.get('phonenumber').setValue(this.account.phonenumber);
        this.accountForm.get('email').setValue(this.account.email);
        this.accountForm.get('contactname').setValue(this.account.contactname);
        this.accountForm.get('billingstatus').setValue(Number(this.account.billingstatusid));
        this.accountForm.get('billingfrequency').setValue(this.account.billingfrequency);

        let created = this.account.created ? new Date(`${this.account.created}`) : '';
        let deletedwhen = this.account.deletedwhen ? new Date(`${this.account.deletedwhen}`) : '';
        let lastmodifieddate = this.account.lastmodifieddate ? new Date(`${this.account.lastmodifieddate}`) : '';

        this.accountForm.get('created').setValue(this.dateFormat(created));
        this.accountForm.get('createdbyname').setValue(this.account.createdbyname);
        this.accountForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.accountForm.get('deletedbyname').setValue(this.account.deletedbyname);
        this.accountForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.accountForm.get('lastmodifiedbyname').setValue(this.account.lastmodifiedbyname);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.accountDetail.name = this.accountForm.get('name').value || '';
        this.accountDetail.address = this.accountForm.get('address').value || '';
        this.accountDetail.email = this.accountForm.get('email').value || '';
        this.accountDetail.phonenumber = this.accountForm.get('phonenumber').value || '';
        this.accountDetail.contactname = this.accountForm.get('contactname').value || '';
        this.accountDetail.billingstatusid = this.accountForm.get('billingstatus').value || 0;
        this.accountDetail.billingfrequency = this.accountForm.get('billingfrequency').value || 0;

        this.accountDetail.isactive = this.account.isactive || true;
        this.accountDetail.deletedwhen = this.account.deletedwhen || '';
        this.accountDetail.deletedby = this.account.deletedby || 0;

        if (mode == "save") {
            this.accountDetail.id = this.account.id;
            this.accountDetail.created = this.account.created;
            this.accountDetail.createdby = this.account.createdby;
            this.accountDetail.lastmodifieddate = dateTime;
            this.accountDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.accountDetail.id = 0;
            this.accountDetail.created = dateTime;
            this.accountDetail.createdby = userID;
            this.accountDetail.lastmodifieddate = dateTime;
            this.accountDetail.lastmodifiedby = userID;
        }

    }

    dateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
        }

        return str;
    }

    saveAccount(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.accountDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.accountDetailService.saveAccountDetail(this.accountDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/accounts/accounts']);
                    }
                });
        }
    }

    addAccount(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.accountDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.accountDetailService.saveAccountDetail(this.accountDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/accounts/accounts']);
                    }
                });
        }
    }

    goBackUnit() {
        const currentState = this.accountForm.value;
        console.log(this.account_detail, currentState);
        if (isEqual(this.account_detail, currentState)) {
            this.router.navigate(['system/accounts/accounts']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { account: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['system/accounts/accounts']);
                }
            });
        }
    }
}