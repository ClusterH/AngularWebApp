import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { UserDetail } from 'app/main/admin/users/model/user.model';
import { UserDetailDataSource } from "app/main/admin/users/services/user_detail.datasource";
import { UserDetailService } from 'app/main/admin/users/services/user_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user_detail.component.html',
    styleUrls: ['./user_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class UserDetailComponent implements OnInit, OnDestroy {
    user_detail: any;
    public user: any;
    pageType: string;

    userModel_flag: boolean;
    userForm: FormGroup;
    userDetail: UserDetail = {};
    displayedColumns: string[] = ['name'];
    dataSourceCompany: UserDetailDataSource;
    dataSourceGroup: UserDetailDataSource;
    dataSourceTimeZone: UserDetailDataSource;
    dataSourceLengthUnit: UserDetailDataSource;
    dataSourceFuelUnit: UserDetailDataSource;
    dataSourceWeightUnit: UserDetailDataSource;
    dataSourceTempUnit: UserDetailDataSource;
    dataSourceLanguage: UserDetailDataSource;

    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator, static: true })
    paginatorGroup: MatPaginator;
    @ViewChild('paginatorTimeZone', { read: MatPaginator, static: true })
    paginatorTimeZone: MatPaginator;
    @ViewChild('paginatorLengthUnit', { read: MatPaginator, static: true })
    paginatorLengthUnit: MatPaginator;
    @ViewChild('paginatorFuelUnit', { read: MatPaginator, static: true })
    paginatorFuelUnit: MatPaginator;
    @ViewChild('paginatorWeightUnit', { read: MatPaginator, static: true })
    paginatorWeightUnit: MatPaginator;
    @ViewChild('paginatorTempUnit', { read: MatPaginator, static: true })
    paginatorTempUnit: MatPaginator;
    @ViewChild('paginatorLanguage', { read: MatPaginator, static: true })
    paginatorLanguage: MatPaginator;

    constructor(
        public userDetailService: UserDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute

    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {

            this.user = data;
        });

        if (isEmpty(this.user)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new UserDetailDataSource(this.userDetailService);
        this.dataSourceGroup = new UserDetailDataSource(this.userDetailService);
        this.dataSourceTimeZone = new UserDetailDataSource(this.userDetailService);
        this.dataSourceLengthUnit = new UserDetailDataSource(this.userDetailService);
        this.dataSourceFuelUnit = new UserDetailDataSource(this.userDetailService);
        this.dataSourceWeightUnit = new UserDetailDataSource(this.userDetailService);
        this.dataSourceTempUnit = new UserDetailDataSource(this.userDetailService);
        this.dataSourceLanguage = new UserDetailDataSource(this.userDetailService);

        this.dataSourceCompany.loadUserDetail(0, 10, this.user.company, "company_clist");
        if (isEmpty(this.user)) {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.user.group, 0, "group_clist");
        } else {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.user.group, this.user.companyid, "group_clist");
        }
        this.dataSourceTimeZone.loadUserDetail(0, 10, this.user.timezone, "timezone_clist");
        this.dataSourceLengthUnit.loadUserDetail(0, 10, '', "lengthunit_clist");
        this.dataSourceFuelUnit.loadUserDetail(0, 10, '', "fuelunit_clist");
        this.dataSourceWeightUnit.loadUserDetail(0, 10, '', "weightunit_clist");
        this.dataSourceTempUnit.loadUserDetail(0, 10, '', "tempunit_clist");
        this.dataSourceLanguage.loadUserDetail(0, 10, '', "language_clist");

        this.userForm = this._formBuilder.group({
            name: [null, Validators.required],
            email: [null, Validators.required],
            password: [null, Validators.required],
            timezone: [null, Validators.required],
            lengthunit: [null, Validators.required],
            fuelunit: [null, Validators.required],
            weightunit: [null, Validators.required],
            tempunit: [null, Validators.required],
            isactive: [null, Validators.required],
            company: [null, Validators.required],
            group: [null, Validators.required],
            subgroup: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            language: [null, Validators.required],
            filterstring: [null],
        });
        this.setValues();
        this.user_detail = this.userForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadUserDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadUserDetail("group") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorLengthUnit.page)
            .pipe(tap(() => { this.loadUserDetail("lengthunit") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorFuelUnit.page)
            .pipe(tap(() => { this.loadUserDetail("fuelunit") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorWeightUnit.page)
            .pipe(tap(() => { this.loadUserDetail("weightunit") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorTempUnit.page)
            .pipe(tap(() => { this.loadUserDetail("tempunit") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorLanguage.page)
            .pipe(tap(() => { this.loadUserDetail("language") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
        merge(this.paginatorTimeZone.page)
            .pipe(tap(() => { this.loadUserDetail("timezone") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadUserDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadUserDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.userForm.get('company').value;
            if (companyid == undefined) {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, 0, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'lengthunit') {
            this.dataSourceLengthUnit.loadUserDetail(this.paginatorLengthUnit.pageIndex, this.paginatorLengthUnit.pageSize, '', `${method_string}_clist`)
        } else if (method_string == 'fuelunit') {
            this.dataSourceFuelUnit.loadUserDetail(this.paginatorFuelUnit.pageIndex, this.paginatorFuelUnit.pageSize, '', `${method_string}_clist`)
        } else if (method_string == 'weightunit') {
            this.dataSourceWeightUnit.loadUserDetail(this.paginatorWeightUnit.pageIndex, this.paginatorWeightUnit.pageSize, '', `${method_string}_clist`)
        } else if (method_string == 'tempunit') {
            this.dataSourceTempUnit.loadUserDetail(this.paginatorTempUnit.pageIndex, this.paginatorTempUnit.pageSize, '', `${method_string}_clist`)
        } else if (method_string == 'language') {
            this.dataSourceLanguage.loadUserDetail(this.paginatorLanguage.pageIndex, this.paginatorLanguage.pageSize, '', `${method_string}_clist`)
        } else if (method_string == 'timezone') {
            this.dataSourceTimeZone.loadUserDetail(this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
                break;
            case 'group':
                this.paginatorGroup.pageIndex = 0;
                break;
            case 'lengthunit':
                this.paginatorLengthUnit.pageIndex = 0;
                break;
            case 'fuelunit':
                this.paginatorFuelUnit.pageIndex = 0;
                break;
            case 'weightunit':
                this.paginatorWeightUnit.pageIndex = 0;
                break;
            case 'tempunit':
                this.paginatorTempUnit.pageIndex = 0;
                break;
            case 'language':
                this.paginatorLanguage.pageIndex = 0;
                break;
            case 'timezone':
                this.paginatorTimeZone.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.userForm.get(`${this.method_string}`).value;
        let clist = this.userDetailService.unit_clist_item[methodString];
        let currentOptionID = clist.findIndex(item => item.id == selected_element_id);

        this.userForm.get('filterstring').setValue(clist[currentOptionID].name);
        this.filter_string = clist[currentOptionID].name;


        this.managePageIndex(this.method_string);
        this.loadUserDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.userForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadUserDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadUserDetail(this.method_string);
        }
    }

    setValues() {
        this.userForm.get('name').setValue(this.user.name);
        this.userForm.get('company').setValue(Number(this.user.companyid));
        this.userForm.get('group').setValue(Number(this.user.groupid));
        this.userForm.get('email').setValue(this.user.email);
        this.userForm.get('password').setValue(this.user.password);
        this.userForm.get('lengthunit').setValue(Number(this.user.lengthunitid));
        this.userForm.get('fuelunit').setValue(Number(this.user.fuelunitid));
        this.userForm.get('weightunit').setValue(Number(this.user.weightunitid));
        this.userForm.get('tempunit').setValue(Number(this.user.tempunitid));
        this.userForm.get('language').setValue(Number(this.user.languageid));
        this.userForm.get('timezone').setValue(Number(this.user.timezoneid));
        let created = this.user.created ? new Date(`${this.user.created}`) : '';
        let deletedwhen = this.user.deletedwhen ? new Date(`${this.user.deletedwhen}`) : '';
        let lastmodifieddate = this.user.lastmodifieddate ? new Date(`${this.user.lastmodifieddate}`) : '';
        this.userForm.get('created').setValue(this.dateFormat(created));
        this.userForm.get('createdbyname').setValue(this.user.createdbyname);
        this.userForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.userForm.get('deletedbyname').setValue(this.user.deletedbyname);
        this.userForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.userForm.get('lastmodifiedbyname').setValue(this.user.lastmodifiedbyname);
        this.userForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.userDetail.name = this.userForm.get('name').value || '';
        this.userDetail.email = this.userForm.get('email').value || '';
        this.userDetail.password = this.userForm.get('password').value || '';
        this.userDetail.timezoneid = this.userForm.get('timezone').value || 0;
        this.userDetail.lengthunitid = this.userForm.get('lengthunit').value || 0;
        this.userDetail.fuelunitid = this.userForm.get('fuelunit').value || 0;
        this.userDetail.weightunitid = this.userForm.get('weightunit').value || 0;
        this.userDetail.tempunitid = this.userForm.get('tempunit').value || 0;
        this.userDetail.companyid = this.userForm.get('company').value || 0;
        this.userDetail.groupid = this.userForm.get('group').value || 0;
        this.userDetail.languageid = this.userForm.get('language').value || 0;
        this.userDetail.userprofileid = this.user.userprofileid || 0;
        this.userDetail.subgroup = this.user.subgroup || 0;
        this.userDetail.isactive = this.user.isactive || true;
        this.userDetail.deletedwhen = this.user.deletedwhen || '';
        this.userDetail.deletedby = this.user.deletedby || 0;
        if (mode == "save") {
            this.userDetail.id = this.user.id;
            this.userDetail.created = this.user.created;
            this.userDetail.createdby = this.user.createdby;
            this.userDetail.lastmodifieddate = dateTime;
            this.userDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.userDetail.id = 0;
            this.userDetail.created = dateTime;
            this.userDetail.createdby = userID;
            this.userDetail.lastmodifieddate = dateTime;
            this.userDetail.lastmodifiedby = userID;
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

    saveUser(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.userDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.userDetailService.saveUserDetail(this.userDetail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if (result.responseCode == 100) {
                        alert("Success!");
                        this.router.navigate(['admin/users/users']);
                    }
                });
        }
    }

    addUser(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.userDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.userDetailService.saveUserDetail(this.userDetail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if (result.responseCode == 100) {
                        alert("Success!");
                        this.router.navigate(['admin/users/users']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.userForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.userForm.value;

        if (isEqual(this.user_detail, currentState)) {
            this.router.navigate(['admin/users/users']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { user: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/users/users']);
                }
            });
        }
    }

    onCompanyChange(event: any) {
        let current_companyID = this.userForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }
}
