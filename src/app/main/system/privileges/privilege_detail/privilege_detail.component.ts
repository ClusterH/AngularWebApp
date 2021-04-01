import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as privilegesEnglish } from 'app/main/system/privileges/i18n/en';
import { locale as privilegesFrench } from 'app/main/system/privileges/i18n/fr';
import { locale as privilegesPortuguese } from 'app/main/system/privileges/i18n/pt';
import { locale as privilegesSpanish } from 'app/main/system/privileges/i18n/sp';
import { PrivilegeDetail } from 'app/main/system/privileges/model/privilege.model';
import { PrivilegeDetailDataSource } from "app/main/system/privileges/services/privilege_detail.datasource";
import { PrivilegeDetailService } from 'app/main/system/privileges/services/privilege_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-privilege-detail',
    templateUrl: './privilege_detail.component.html',
    styleUrls: ['./privilege_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class PrivilegeDetailComponent implements OnInit, OnDestroy {
    privilege_detail: any;
    public privilege: any;
    pageType: string;
    userConncode: string;
    userID: number;
    privilegeObject_flag: boolean;
    privilegeForm: FormGroup;
    privilegeDetail: PrivilegeDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: PrivilegeDetailDataSource;
    dataSourcePrivType: PrivilegeDetailDataSource;
    dataSourcePrivObject: PrivilegeDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorPrivType: MatPaginator;
    @ViewChild('paginatorPrivObject', { read: MatPaginator }) paginatorPrivObject: MatPaginator;

    constructor(
        public privilegeDetailService: PrivilegeDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(privilegesEnglish, privilegesSpanish, privilegesFrench, privilegesPortuguese);
        this._unsubscribeAll = new Subject();
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {

            this.privilege = data;
        });

        if (isEmpty(this.privilege)) {
            this.privilegeDetailService.current_typeID = 0;
            this.privilegeObject_flag = false;
            this.pageType = 'new';
        } else {
            if (this.privilege.typeid != 0) {
                this.privilegeDetailService.current_typeID = this.privilege.typeid;
                this.privilegeObject_flag = true;
            } else {
                this.privilegeDetailService.current_typeID = 0;
            }
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourcePrivType = new PrivilegeDetailDataSource(this.privilegeDetailService);
        this.dataSourcePrivObject = new PrivilegeDetailDataSource(this.privilegeDetailService);
        this.dataSourcePrivType.loadPrivilegeDetail(0, 5, this.privilege.type, "privtype_clist");
        if (this.privilegeObject_flag) {
            this.dataSourcePrivObject.loadPrivilegeDetail(0, 5, this.privilege.object, "privobject_clist");
        }

        this.privilegeForm = this._formBuilder.group({
            name: [null, Validators.required],
            privtype: [null, Validators.required],
            privobject: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });
        this.setValues();
        this.privilege_detail = this.privilegeForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorPrivType.page)
            .pipe(tap(() => { this.loadPrivilegeDetail("privtype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        if (this.privilegeObject_flag) {
            merge(this.paginatorPrivObject.page)
                .pipe(tap(() => { this.loadPrivilegeDetail('privobject') }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadPrivilegeDetail(method_string: string) {
        if (method_string == 'privtype') {
            this.dataSourcePrivType.loadPrivilegeDetail(this.paginatorPrivType.pageIndex, this.paginatorPrivType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'privobject') {
            this.dataSourcePrivObject.loadPrivilegeDetail(this.paginatorPrivObject.pageIndex, this.paginatorPrivObject.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'privtype':
                this.paginatorPrivType.pageIndex = 0;
                break;
            case 'privobject':
                this.paginatorPrivObject.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        const methodString = item;
        this.method_string = item.split('_')[0];
        if (this.method_string == 'privobject' && !this.privilegeObject_flag) {
            alert("Please select Type first!");
        } else {
            const selected_element_id = this.privilegeForm.get(`${this.method_string}`).value;
            const clist = this.privilegeDetailService.unit_clist_item[methodString];
            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.privilegeForm.get('filterstring').setValue(clist[i] ? clist[i].name : '');
                    this.filter_string = clist[i] ? clist[i].name : '';
                }
            }
        }

        this.managePageIndex(this.method_string);
        this.loadPrivilegeDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.privilegeForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadPrivilegeDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadPrivilegeDetail(this.method_string);
        }
    }

    setValues() {
        this.privilegeForm.get('name').setValue(this.privilege.name);
        this.privilegeForm.get('privtype').setValue(Number(this.privilege.typeid));
        this.privilegeForm.get('privobject').setValue(Number(this.privilege.objectid));
        let created = this.privilege.created ? new Date(`${this.privilege.created}`) : '';
        let deletedwhen = this.privilege.deletedwhen ? new Date(`${this.privilege.deletedwhen}`) : '';
        let lastmodifieddate = this.privilege.lastmodifieddate ? new Date(`${this.privilege.lastmodifieddate}`) : '';

        this.privilegeForm.get('created').setValue(this.dateFormat(created));
        this.privilegeForm.get('createdbyname').setValue(this.privilege.createdbyname);
        this.privilegeForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.privilegeForm.get('deletedbyname').setValue(this.privilege.deletedbyname);
        this.privilegeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.privilegeForm.get('lastmodifiedbyname').setValue(this.privilege.lastmodifiedbyname);
        this.privilegeForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.privilegeDetail.name = this.privilegeForm.get('name').value || '';
        this.privilegeDetail.typeid = this.privilegeForm.get('privtype').value || 0;
        this.privilegeDetail.objectid = this.privilegeForm.get('privobject').value || 0;
        this.privilegeDetail.isactive = this.privilege.isactive || true;
        this.privilegeDetail.deletedwhen = this.privilege.deletedwhen || '';
        this.privilegeDetail.deletedby = this.privilege.deletedby || 0;

        if (mode == "save") {
            this.privilegeDetail.id = this.privilege.id;
            this.privilegeDetail.created = this.privilege.created;
            this.privilegeDetail.createdby = this.privilege.createdby;
            this.privilegeDetail.lastmodifieddate = dateTime;
            this.privilegeDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.privilegeDetail.id = 0;
            this.privilegeDetail.created = dateTime;
            this.privilegeDetail.createdby = userID;
            this.privilegeDetail.lastmodifieddate = dateTime;
            this.privilegeDetail.lastmodifiedby = userID;
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

    savePrivilege(): void {
        const today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.privilegeDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.privilegeDetailService.savePrivilegeDetail(this.privilegeDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/privileges/privileges']);
                    }
                });
        }
    }

    addPrivilege(): void {
        const today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.privilegeDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.privilegeDetailService.savePrivilegeDetail(this.privilegeDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/privileges/privileges']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.privilegeForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.privilegeForm.value;

        if (isEqual(this.privilege_detail, currentState)) {
            this.router.navigate(['system/privileges/privileges']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { privilege: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result) {
                    this.router.navigate(['system/privileges/privileges']);
                }
            });
        }
    }

    onTypeChange(event: any) {
        this.privilegeDetailService.current_typeID = this.privilegeForm.get('privtype').value;
        this.privilegeObject_flag = true;
        this.dataSourcePrivObject.loadPrivilegeDetail(0, 5, "", "privobject_clist");
    }

    checkTypeIsSelected() {
        alert("Please check first Type is selected!");
    }
}