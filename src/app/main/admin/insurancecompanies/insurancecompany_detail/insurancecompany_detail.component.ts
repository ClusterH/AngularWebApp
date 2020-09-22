import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as insurancecompaniesEnglish } from 'app/main/admin/insurancecompanies/i18n/en';
import { locale as insurancecompaniesFrench } from 'app/main/admin/insurancecompanies/i18n/fr';
import { locale as insurancecompaniesPortuguese } from 'app/main/admin/insurancecompanies/i18n/pt';
import { locale as insurancecompaniesSpanish } from 'app/main/admin/insurancecompanies/i18n/sp';
import { InsurancecompanyDetail } from 'app/main/admin/insurancecompanies/model/insurancecompany.model';
import { InsurancecompanyDetailDataSource } from "app/main/admin/insurancecompanies/services/insurancecompany_detail.datasource";
import { InsurancecompanyDetailService } from 'app/main/admin/insurancecompanies/services/insurancecompany_detail.service';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-insurancecompany-detail',
    templateUrl: './insurancecompany_detail.component.html',
    styleUrls: ['./insurancecompany_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InsurancecompanyDetailComponent implements OnInit, OnDestroy {
    insurancecompany_detail: any;
    public insurancecompany: any;
    pageType: string;
    userConncode: string;
    userID: number;
    insurancecompanyForm: FormGroup;
    insurancecompanyDetail: InsurancecompanyDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: InsurancecompanyDetailDataSource;
    dataSourceAccount: InsurancecompanyDetailDataSource;
    dataSourceInsurancecompanyType: InsurancecompanyDetailDataSource;
    dataSourceUserProfile: InsurancecompanyDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorInsurancecompany: MatPaginator;
    @ViewChild('paginatorAccount', { read: MatPaginator, static: true })
    paginatorAccount: MatPaginator;
    @ViewChild('paginatorInsurancecompanyType', { read: MatPaginator, static: true })
    paginatorInsurancecompanyType: MatPaginator;
    @ViewChild('paginatorUserProfile', { read: MatPaginator, static: true })
    paginatorUserProfile: MatPaginator;

    constructor(
        private insurancecompanyDetailService: InsurancecompanyDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(insurancecompaniesEnglish, insurancecompaniesSpanish, insurancecompaniesFrench, insurancecompaniesPortuguese);
        this.activatedRoute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.insurancecompany = data;
        });
        if (isEmpty(this.insurancecompany)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceAccount = new InsurancecompanyDetailDataSource(this.insurancecompanyDetailService);
        this.dataSourceInsurancecompanyType = new InsurancecompanyDetailDataSource(this.insurancecompanyDetailService);
        this.dataSourceUserProfile = new InsurancecompanyDetailDataSource(this.insurancecompanyDetailService);
        this.dataSourceAccount.loadInsurancecompanyDetail(0, 10, this.insurancecompany.account, "account_clist");
        this.dataSourceInsurancecompanyType.loadInsurancecompanyDetail(0, 10, this.insurancecompany.companytype, "companytype_clist");
        this.dataSourceUserProfile.loadInsurancecompanyDetail(0, 10, this.insurancecompany.userprofile, "userprofile_clist");

        this.insurancecompanyForm = this._formBuilder.group({
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
            insurancecompanytype: [null, Validators.required],
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
        this.insurancecompany_detail = this.insurancecompanyForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorAccount.page)
            .pipe(tap(() => { this.loadInsurancecompanyDetail("account") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorInsurancecompanyType.page)
            .pipe(tap(() => { this.loadInsurancecompanyDetail("insurancecompanytype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorUserProfile.page).pipe(
            tap(() => { this.loadInsurancecompanyDetail("userprofile") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadInsurancecompanyDetail(method_string: string) {
        if (method_string == 'account') {
            this.dataSourceAccount.loadInsurancecompanyDetail(this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'insurancecompanytype') {
            this.dataSourceInsurancecompanyType.loadInsurancecompanyDetail(this.paginatorInsurancecompanyType.pageIndex, this.paginatorInsurancecompanyType.pageSize, this.filter_string, 'companytype_clist')
        } else if (method_string == 'userprofile') {
            this.dataSourceUserProfile.loadInsurancecompanyDetail(this.paginatorUserProfile.pageIndex, this.paginatorUserProfile.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'account':
                this.paginatorAccount.pageIndex = 0;
                break;
            case 'insurancecompanytype':
                this.paginatorInsurancecompanyType.pageIndex = 0;
                break;
            case 'userprofile':
                this.paginatorUserProfile.pageIndex = 0;
                break;
        }
    }

    showInsurancecompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.insurancecompanyForm.get(`${this.method_string}`).value;
        let clist = this.insurancecompanyDetailService.insurancecompany_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.insurancecompanyForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadInsurancecompanyDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.insurancecompanyForm.get('filterstring').setValue(this.filter_string);
        // this.paginatorInsurancecompany.pageIndex = 0;
        this.managePageIndex(this.method_string);
        this.loadInsurancecompanyDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadInsurancecompanyDetail(this.method_string);
        }
    }

    setValues() {
        this.insurancecompanyForm.get('name').setValue(this.insurancecompany.name);
        this.insurancecompanyForm.get('orgno').setValue(this.insurancecompany.orgno);
        this.insurancecompanyForm.get('account').setValue(Number(this.insurancecompany.accountid));
        this.insurancecompanyForm.get('insurancecompanytype').setValue(Number(this.insurancecompany.insurancecompanytypeid));
        this.insurancecompanyForm.get('userprofile').setValue(Number(this.insurancecompany.userprofileid));

        let created = this.insurancecompany ? new Date(`${this.insurancecompany.created}`) : '';
        let deletedwhen = this.insurancecompany ? new Date(`${this.insurancecompany.deletedwhen}`) : '';
        let lastmodifieddate = this.insurancecompany ? new Date(`${this.insurancecompany.lastmodifieddate}`) : '';

        this.insurancecompanyForm.get('created').setValue(this.dateFormat(created));
        this.insurancecompanyForm.get('createdbyname').setValue(this.insurancecompany.createdbyname);
        this.insurancecompanyForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.insurancecompanyForm.get('deletedbyname').setValue(this.insurancecompany.deletedbyname);
        this.insurancecompanyForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.insurancecompanyForm.get('lastmodifiedbyname').setValue(this.insurancecompany.lastmodifiedbyname);

        this.insurancecompanyForm.get('emailserver').setValue(this.insurancecompany.emailserver)
        this.insurancecompanyForm.get('emailsender').setValue(this.insurancecompany.emailsender)
        this.insurancecompanyForm.get('emailuser').setValue(this.insurancecompany.emailuser)
        this.insurancecompanyForm.get('emailpassword').setValue(this.insurancecompany.emailpassword)
        this.insurancecompanyForm.get('logofile').setValue(this.insurancecompany.logofile)
        this.insurancecompanyForm.get('address').setValue(this.insurancecompany.address)
        this.insurancecompanyForm.get('country').setValue(this.insurancecompany.country)
        this.insurancecompanyForm.get('contactname').setValue(this.insurancecompany.contactname)
        this.insurancecompanyForm.get('phone').setValue(this.insurancecompany.phone)
        this.insurancecompanyForm.get('email').setValue(this.insurancecompany.email)
        this.insurancecompanyForm.get('comments').setValue(this.insurancecompany.comments)
        this.insurancecompanyForm.get('billingnote').setValue(this.insurancecompany.billingnote)
        this.insurancecompanyForm.get('webstartlat').setValue(this.insurancecompany.webstartlat)
        this.insurancecompanyForm.get('webstartlong').setValue(this.insurancecompany.webstartlong)
        this.insurancecompanyForm.get('hasprivatelabel').setValue(this.insurancecompany.hasprivatelabel)

        this.insurancecompanyForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.insurancecompanyDetail.name = this.insurancecompanyForm.get('name').value || '';
        this.insurancecompanyDetail.orgno = this.insurancecompanyForm.get('orgno').value || '';
        this.insurancecompanyDetail.accountid = this.insurancecompanyForm.get('account').value || 0;
        this.insurancecompanyDetail.insurancecompanytypeid = this.insurancecompanyForm.get('insurancecompanytype').value || 0;
        this.insurancecompanyDetail.userprofileid = this.insurancecompanyForm.get('userprofile').value || 0;
        this.insurancecompanyDetail.emailserver = this.insurancecompanyForm.get('emailserver').value || '';
        this.insurancecompanyDetail.emailsender = this.insurancecompanyForm.get('emailsender').value || '';
        this.insurancecompanyDetail.emailuser = this.insurancecompanyForm.get('emailuser').value || '';
        this.insurancecompanyDetail.emailpassword = this.insurancecompanyForm.get('emailpassword').value || '';
        this.insurancecompanyDetail.logofile = this.insurancecompanyForm.get('logofile').value || '';
        this.insurancecompanyDetail.address = this.insurancecompanyForm.get('address').value || '';
        this.insurancecompanyDetail.country = this.insurancecompanyForm.get('country').value || '';
        this.insurancecompanyDetail.contactname = this.insurancecompanyForm.get('contactname').value || '';
        this.insurancecompanyDetail.phone = this.insurancecompanyForm.get('phone').value || '';
        this.insurancecompanyDetail.email = this.insurancecompanyForm.get('email').value || '';
        this.insurancecompanyDetail.comments = this.insurancecompanyForm.get('comments').value || '';
        this.insurancecompanyDetail.billingnote = this.insurancecompanyForm.get('billingnote').value || '';
        this.insurancecompanyDetail.webstartlat = this.insurancecompanyForm.get('webstartlat').value || 0;
        this.insurancecompanyDetail.webstartlong = this.insurancecompanyForm.get('webstartlong').value || 0;
        this.insurancecompanyDetail.hasprivatelabel = this.insurancecompanyForm.get('hasprivatelabel').value || false;

        this.insurancecompanyDetail.isactive = this.insurancecompany.isactive || true;
        this.insurancecompanyDetail.deletedwhen = this.insurancecompany.deletedwhen || '';
        this.insurancecompanyDetail.deletedby = this.insurancecompany.deletedby || 0;

        if (mode == "save") {
            this.insurancecompanyDetail.id = this.insurancecompany.id;
            this.insurancecompanyDetail.created = this.insurancecompany.created;
            this.insurancecompanyDetail.createdby = this.insurancecompany.createdby;
            this.insurancecompanyDetail.lastmodifieddate = dateTime;
            this.insurancecompanyDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.insurancecompanyDetail.id = 0;
            this.insurancecompanyDetail.created = dateTime;
            this.insurancecompanyDetail.createdby = userID;
            this.insurancecompanyDetail.lastmodifieddate = dateTime;
            this.insurancecompanyDetail.lastmodifiedby = userID;
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

    saveInsurancecompany(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.insurancecompanyDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.insurancecompanyDetailService.saveInsurancecompanyDetail(this.insurancecompanyDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
                    }
                });
        }
    }

    addInsurancecompany(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.insurancecompanyDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.insurancecompanyDetailService.saveInsurancecompanyDetail(this.insurancecompanyDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.insurancecompanyForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.insurancecompanyForm.value;
        if (isEqual(this.insurancecompany_detail, currentState)) {
            this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = {
                insurancecompany: "", flag: flag
            };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
                }
            });
        }
    }
}