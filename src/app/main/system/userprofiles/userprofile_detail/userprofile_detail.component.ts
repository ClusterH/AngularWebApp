import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { UserProfileDetail } from 'app/main/system/userprofiles/model/userprofile.model';
import { CourseDialogComponent } from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { UserProfileDetailService } from 'app/main/system/userprofiles/services/userprofile_detail.service';
import { UserProfileDetailDataSource } from "app/main/system/userprofiles/services/userprofile_detail.datasource"

import { locale as userprofilesEnglish } from 'app/main/system/userprofiles/i18n/en';
import { locale as userprofilesSpanish } from 'app/main/system/userprofiles/i18n/sp';
import { locale as userprofilesFrench } from 'app/main/system/userprofiles/i18n/fr';
import { locale as userprofilesPortuguese } from 'app/main/system/userprofiles/i18n/pt';
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-userprofile-detail',
    templateUrl: './userprofile_detail.component.html',
    styleUrls: ['./userprofile_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class UserProfileDetailComponent implements OnInit {
    userprofile_detail: any;
    public userprofile: any;
    pageType: string;
    userConncode: string;
    userID: number;
    userprofileForm: FormGroup;
    userprofileDetail: UserProfileDetail = {};
    get_module_access: any[];
    get_report_access: any[];
    get_command_access: any[];
    access_restric_list = ['Denied', 'Read', 'Edit', 'Full'];
    dataSourceCompany: UserProfileDetailDataSource;
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';

    privilegeAccessArray: any[];
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;

    constructor(
        public userprofileDetailService: UserProfileDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(userprofilesEnglish, userprofilesSpanish, userprofilesFrench, userprofilesPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.userprofile = data;

        });

        if (isEmpty(this.userprofile)) {
            this.userprofileDetailService.current_userprofileID = 0;
            this.pageType = 'new';
        } else {
            this.userprofileDetailService.current_userprofileID = this.userprofile.id;
            this.pageType = 'edit';
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new UserProfileDetailDataSource(this.userprofileDetailService);
        this.dataSourceCompany.loadUserProfileDetail(0, 10, '', "company_clist");
        this.userprofileForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            isactive: [null],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });
        if (this.userprofileDetailService.current_userprofileID != 0) {
            this.userprofileDetailService.getPrivilegeAccess(this.userprofileDetailService.current_userprofileID, 1).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (res.responseCode == 100) {
                        this.get_module_access = res.TrackingXLAPI.DATA;
                        for (let module in this.get_module_access) {
                            let module_form = new FormControl('')
                            this.userprofileForm.addControl(this.get_module_access[module].privilege.toString(), module_form);
                            this.userprofileForm.get(`${this.get_module_access[module].privilege}`).setValue(this.access_restric_list[this.get_module_access[module].accesslevel]);
                        }
                    } else {
                        alert('No Data Found for module!');
                    }
                });

            this.userprofileDetailService.getPrivilegeAccess(this.userprofileDetailService.current_userprofileID, 2).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (res.responseCode == 100) {
                        this.get_report_access = res.TrackingXLAPI.DATA;
                        for (let report in this.get_report_access) {
                            let report_form = new FormControl('')
                            this.userprofileForm.addControl(this.get_report_access[report].privilege.toString(), report_form);
                            this.userprofileForm.get(`${this.get_report_access[report].privilege}`).setValue(this.get_report_access[report].accesslevel > 0 ? true : false);
                        }
                    } else {
                        alert('No Data Found for Report!');
                    }
                });

            this.userprofileDetailService.getPrivilegeAccess(this.userprofileDetailService.current_userprofileID, 4).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (res.responseCode == 100) {
                        this.get_command_access = res.TrackingXLAPI.DATA;

                        for (let command in this.get_command_access) {
                            let command_form = new FormControl('')
                            this.userprofileForm.addControl(this.get_command_access[command].privilege.toString(), command_form);
                            this.userprofileForm.get(`${this.get_command_access[command].privilege}`).setValue(this.get_command_access[command].accesslevel > 0 ? true : false);
                        }
                    } else {
                        alert('No Data Found for Command!');
                    }
                });
        }

        this.setValues();
        this.userprofile_detail = this.userprofileForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadUserProfileDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadUserProfileDetail(this.method_string);
        }
    }

    clearFilter() {
        this.filter_string = '';
        this.userprofileForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadUserProfileDetail(this.method_string);
    }

    loadUserProfileDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadUserProfileDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        const methodString = item;
        this.method_string = item.split('_')[0];
        const selected_element_id = this.userprofileForm.get(`${this.method_string}`).value;
        const clist = this.userprofileDetailService.unit_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.userprofileForm.get('filterstring').setValue(clist[i] ? clist[i].name : '');
                this.filter_string = clist[i] ? clist[i].name : '';
            }
        }

        this.managePageIndex(this.method_string);
        this.loadUserProfileDetail(this.method_string);
    }

    setValues() {
        this.userprofileForm.get('name').setValue(this.userprofile.name);
        this.userprofileForm.get('company').setValue(Number(this.userprofile.companyid));
        const created = this.userprofile.createdwhen ? new Date(`${this.userprofile.createdwhen}`) : '';
        const lastmodifieddate = this.userprofile.lastmodifieddate ? new Date(`${this.userprofile.lastmodifieddate}`) : '';

        this.userprofileForm.get('created').setValue(this.dateFormat(created));
        this.userprofileForm.get('createdbyname').setValue(this.userprofile.createdbyname);
        this.userprofileForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.userprofileForm.get('lastmodifiedbyname').setValue(this.userprofile.lastmodifiedbyname);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.userprofileDetail.name = this.userprofileForm.get('name').value || '';
        this.userprofileDetail.isactive = this.userprofile.isactive || true;
        this.userprofileDetail.companyid = this.userprofileForm.get('company').value || 0;

        this.getPrivilegeAccess();

        if (mode == "save") {
            this.userprofileDetail.id = this.userprofile.id;
            this.userprofileDetail.createdwhen = this.userprofile.createdwhen || '';
            this.userprofileDetail.createdby = this.userprofile.createdby || 0;
            this.userprofileDetail.lastmodifieddate = dateTime;
            this.userprofileDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.userprofileDetail.id = 0;
            this.userprofileDetail.createdwhen = dateTime;
            this.userprofileDetail.createdby = userID;
            this.userprofileDetail.lastmodifieddate = dateTime;
            this.userprofileDetail.lastmodifiedby = userID;
        }
    }

    getPrivilegeAccess() {
        let modulesAccess = [];
        let reportsAccess = [];
        let commandsAccess = [];
        for (let module in this.get_module_access) {
            modulesAccess.push({
                userprofileid: this.userprofile.id,
                privilegeid: this.get_module_access[module].privilegeid,
                accesslevel: this.access_restric_list.findIndex(item => item === this.userprofileForm.get(`${this.get_module_access[module].privilege}`).value)
            })
        }
        for (let report in this.get_report_access) {
            reportsAccess.push({
                userprofileid: this.userprofile.id,
                privilegeid: this.get_report_access[report].privilegeid,
                accesslevel: this.userprofileForm.get(`${this.get_report_access[report].privilege}`).value ? 3 : 0
            })
        }
        for (let command in this.get_command_access) {
            commandsAccess.push({
                userprofileid: this.userprofile.id,
                privilegeid: this.get_command_access[command].privilegeid,
                accesslevel: this.userprofileForm.get(`${this.get_command_access[command].privilege}`).value ? 3 : 0
            })
        }

        this.privilegeAccessArray = [...modulesAccess, ...reportsAccess, ...commandsAccess];
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

    saveUserProfile(): void {
        const today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.userprofileDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.userprofileDetailService.saveUserProfileDetail(this.userprofileDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {

                        this.userprofileDetailService.saveAccess(this.privilegeAccessArray).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                            if (res.responseCode === 100) {
                                this.router.navigate(['system/userprofiles/userprofiles']);
                            }
                        });
                    }
                });
        }
    }

    addUserProfile(): void {
        const today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.userprofileDetail.name == '') {
            alert('Please enter Detail Name.')
        } else {
            this.userprofileDetailService.saveUserProfileDetail(this.userprofileDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/userprofiles/userprofiles']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.userprofileForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.userprofileForm.value;

        if (isEqual(this.userprofile_detail, currentState)) {
            this.router.navigate(['system/userprofiles/userprofiles']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { userprofile: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['system/userprofiles/userprofiles']);
                }
            });
        }
    }
}