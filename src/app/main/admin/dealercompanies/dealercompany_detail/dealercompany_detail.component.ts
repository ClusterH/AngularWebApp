import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as dealercompaniesEnglish } from 'app/main/admin/dealercompanies/i18n/en';
import { locale as dealercompaniesFrench } from 'app/main/admin/dealercompanies/i18n/fr';
import { locale as dealercompaniesPortuguese } from 'app/main/admin/dealercompanies/i18n/pt';
import { locale as dealercompaniesSpanish } from 'app/main/admin/dealercompanies/i18n/sp';
import { DealercompanyDetail } from 'app/main/admin/dealercompanies/model/dealercompany.model';
import { DealercompanyDetailDataSource } from "app/main/admin/dealercompanies/services/dealercompany_detail.datasource";
import { DealercompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-dealercompany-detail',
    templateUrl: './dealercompany_detail.component.html',
    styleUrls: ['./dealercompany_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DealercompanyDetailComponent implements OnInit, OnDestroy {
    dealercompany_detail: any;
    public dealercompany: any;
    pageType: string;
    userConncode: string;
    userID: number;
    dealercompanyForm: FormGroup;
    dealercompanyDetail: DealercompanyDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: DealercompanyDetailDataSource;
    dataSourceAccount: DealercompanyDetailDataSource;
    dataSourceDealercompanyType: DealercompanyDetailDataSource;
    dataSourceUserProfile: DealercompanyDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorDealercompany: MatPaginator;
    @ViewChild('paginatorAccount', { read: MatPaginator, static: true })
    paginatorAccount: MatPaginator;
    @ViewChild('paginatorDealercompanyType', { read: MatPaginator, static: true })
    paginatorDealercompanyType: MatPaginator;
    @ViewChild('paginatorUserProfile', { read: MatPaginator, static: true })
    paginatorUserProfile: MatPaginator;

    constructor(
        private dealercompanyDetailService: DealercompanyDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(dealercompaniesEnglish, dealercompaniesSpanish, dealercompaniesFrench, dealercompaniesPortuguese);
        this.activatedRoute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.dealercompany = data;
        });
        if (isEmpty(this.dealercompany)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceAccount = new DealercompanyDetailDataSource(this.dealercompanyDetailService);
        this.dataSourceDealercompanyType = new DealercompanyDetailDataSource(this.dealercompanyDetailService);
        this.dataSourceUserProfile = new DealercompanyDetailDataSource(this.dealercompanyDetailService);
        this.dataSourceAccount.loadDealercompanyDetail(0, 10, this.dealercompany.account, "account_clist");
        this.dataSourceDealercompanyType.loadDealercompanyDetail(0, 10, this.dealercompany.companytype, "companytype_clist");
        this.dataSourceUserProfile.loadDealercompanyDetail(0, 10, this.dealercompany.userprofile, "userprofile_clist");

        this.dealercompanyForm = this._formBuilder.group({
            name: [null, Validators.required],
            account: [null, Validators.required],
            address: [null, Validators.required],
            logofile: [null, Validators.required],
            country: [null, Validators.required],
            contactname: [null, Validators.required],
            phone: [null, Validators.required],
            email: [null, Validators.required],
            comments: [null, Validators.required],
            orgno: [null, Validators.required],
            dealercompanytype: [null, Validators.required],
            isactive: [null, Validators.required],
            webstartlat: [null, Validators.required],
            webstartlong: [null, Validators.required],
            userprofile: [null, Validators.required],
            hasprivatelabel: [null, Validators.required],
            emailserver: [null, Validators.required],
            emailsender: [null, Validators.required],
            emailuser: [null, Validators.required],
            emailpassword: [null, Validators.required],
            billingnote: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });

        this.setValues();
        this.dealercompany_detail = this.dealercompanyForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorAccount.page)
            .pipe(tap(() => { this.loadDealercompanyDetail("account") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorDealercompanyType.page)
            .pipe(tap(() => { this.loadDealercompanyDetail("companytype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorUserProfile.page).pipe(
            tap(() => { this.loadDealercompanyDetail("userprofile") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadDealercompanyDetail(method_string: string) {
        if (method_string == 'account') {
            this.dataSourceAccount.loadDealercompanyDetail(this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'companytype') {
            this.dataSourceDealercompanyType.loadDealercompanyDetail(this.paginatorDealercompanyType.pageIndex, this.paginatorDealercompanyType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'userprofile') {
            this.dataSourceUserProfile.loadDealercompanyDetail(this.paginatorUserProfile.pageIndex, this.paginatorUserProfile.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'account':
                this.paginatorAccount.pageIndex = 0;
                break;
            case 'companytype':
                this.paginatorDealercompanyType.pageIndex = 0;
                break;
            case 'userprofile':
                this.paginatorUserProfile.pageIndex = 0;
                break;
        }
    }

    showDealercompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.dealercompanyForm.get(`${this.method_string}`).value;
        let clist = this.dealercompanyDetailService.dealercompany_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.dealercompanyForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadDealercompanyDetail(this.method_string);
    }

    clearFilter() {

        this.filter_string = '';
        this.dealercompanyForm.get('filterstring').setValue(this.filter_string);
        // this.paginatorDealercompany.pageIndex = 0;
        this.managePageIndex(this.method_string);
        this.loadDealercompanyDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;

        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadDealercompanyDetail(this.method_string);
        }
    }

    setValues() {
        this.dealercompanyForm.get('name').setValue(this.dealercompany.name);
        this.dealercompanyForm.get('orgno').setValue(this.dealercompany.orgno);
        this.dealercompanyForm.get('account').setValue(Number(this.dealercompany.accountid));
        this.dealercompanyForm.get('dealercompanytype').setValue(Number(this.dealercompany.dealercompanytypeid));
        this.dealercompanyForm.get('userprofile').setValue(Number(this.dealercompany.userprofileid));

        let created = this.dealercompany ? new Date(`${this.dealercompany.created}`) : '';
        let deletedwhen = this.dealercompany ? new Date(`${this.dealercompany.deletedwhen}`) : '';
        let lastmodifieddate = this.dealercompany ? new Date(`${this.dealercompany.lastmodifieddate}`) : '';

        this.dealercompanyForm.get('created').setValue(this.dateFormat(created));
        this.dealercompanyForm.get('createdbyname').setValue(this.dealercompany.createdbyname);
        this.dealercompanyForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.dealercompanyForm.get('deletedbyname').setValue(this.dealercompany.deletedbyname);
        this.dealercompanyForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.dealercompanyForm.get('lastmodifiedbyname').setValue(this.dealercompany.lastmodifiedbyname);

        this.dealercompanyForm.get('emailserver').setValue(this.dealercompany.emailserver)
        this.dealercompanyForm.get('emailsender').setValue(this.dealercompany.emailsender)
        this.dealercompanyForm.get('emailuser').setValue(this.dealercompany.emailuser)
        this.dealercompanyForm.get('emailpassword').setValue(this.dealercompany.emailpassword)
        this.dealercompanyForm.get('logofile').setValue(this.dealercompany.logofile)
        this.dealercompanyForm.get('address').setValue(this.dealercompany.address)
        this.dealercompanyForm.get('country').setValue(this.dealercompany.country)
        this.dealercompanyForm.get('contactname').setValue(this.dealercompany.contactname)
        this.dealercompanyForm.get('phone').setValue(this.dealercompany.phone)
        this.dealercompanyForm.get('email').setValue(this.dealercompany.email)
        this.dealercompanyForm.get('comments').setValue(this.dealercompany.comments)
        this.dealercompanyForm.get('billingnote').setValue(this.dealercompany.billingnote)
        this.dealercompanyForm.get('webstartlat').setValue(this.dealercompany.webstartlat)
        this.dealercompanyForm.get('webstartlong').setValue(this.dealercompany.webstartlong)
        this.dealercompanyForm.get('hasprivatelabel').setValue(this.dealercompany.hasprivatelabel)

        this.dealercompanyForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.dealercompanyDetail.name = this.dealercompanyForm.get('name').value || '';
        this.dealercompanyDetail.orgno = this.dealercompanyForm.get('orgno').value || '';
        this.dealercompanyDetail.accountid = this.dealercompanyForm.get('account').value || 0;
        this.dealercompanyDetail.dealercompanytypeid = this.dealercompanyForm.get('dealercompanytype').value || 0;
        this.dealercompanyDetail.userprofileid = this.dealercompanyForm.get('userprofile').value || 0;
        this.dealercompanyDetail.emailserver = this.dealercompanyForm.get('emailserver').value || '';
        this.dealercompanyDetail.emailsender = this.dealercompanyForm.get('emailsender').value || '';
        this.dealercompanyDetail.emailuser = this.dealercompanyForm.get('emailuser').value || '';
        this.dealercompanyDetail.emailpassword = this.dealercompanyForm.get('emailpassword').value || '';
        this.dealercompanyDetail.logofile = this.dealercompanyForm.get('logofile').value || '';
        this.dealercompanyDetail.address = this.dealercompanyForm.get('address').value || '';
        this.dealercompanyDetail.country = this.dealercompanyForm.get('country').value || '';
        this.dealercompanyDetail.contactname = this.dealercompanyForm.get('contactname').value || '';
        this.dealercompanyDetail.phone = this.dealercompanyForm.get('phone').value || '';
        this.dealercompanyDetail.email = this.dealercompanyForm.get('email').value || '';
        this.dealercompanyDetail.comments = this.dealercompanyForm.get('comments').value || '';
        this.dealercompanyDetail.billingnote = this.dealercompanyForm.get('billingnote').value || '';
        this.dealercompanyDetail.webstartlat = this.dealercompanyForm.get('webstartlat').value || 0;
        this.dealercompanyDetail.webstartlong = this.dealercompanyForm.get('webstartlong').value || 0;
        this.dealercompanyDetail.hasprivatelabel = this.dealercompanyForm.get('hasprivatelabel').value || false;

        this.dealercompanyDetail.isactive = this.dealercompany.isactive || true;
        this.dealercompanyDetail.deletedwhen = this.dealercompany.deletedwhen || '';
        this.dealercompanyDetail.deletedby = this.dealercompany.deletedby || 0;

        if (mode == "save") {
            this.dealercompanyDetail.id = this.dealercompany.id;
            this.dealercompanyDetail.created = this.dealercompany.created;
            this.dealercompanyDetail.createdby = this.dealercompany.createdby;
            this.dealercompanyDetail.lastmodifieddate = dateTime;
            this.dealercompanyDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.dealercompanyDetail.id = 0;
            this.dealercompanyDetail.created = dateTime;
            this.dealercompanyDetail.createdby = userID;
            this.dealercompanyDetail.lastmodifieddate = dateTime;
            this.dealercompanyDetail.lastmodifiedby = userID;
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

    saveDealercompany(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.dealercompanyDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.dealercompanyDetailService.saveDealercompanyDetail(this.dealercompanyDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/dealercompanies/dealercompanies']);
                    }
                });
        }
    }

    addDealercompany(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.dealercompanyDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.dealercompanyDetailService.saveDealercompanyDetail(this.dealercompanyDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/dealercompanies/dealercompanies']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.dealercompanyForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.dealercompanyForm.value;
        if (isEqual(this.dealercompany_detail, currentState)) {
            this.router.navigate(['admin/dealercompanies/dealercompanies']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = {
                dealercompany: "", flag: flag
            };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/dealercompanies/dealercompanies']);
                }
            });
        }
    }
}