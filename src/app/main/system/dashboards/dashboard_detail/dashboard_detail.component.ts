import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as dashboardsEnglish } from 'app/main/system/dashboards/i18n/en';
import { locale as dashboardsFrench } from 'app/main/system/dashboards/i18n/fr';
import { locale as dashboardsPortuguese } from 'app/main/system/dashboards/i18n/pt';
import { locale as dashboardsSpanish } from 'app/main/system/dashboards/i18n/sp';
import { DashboardDetail } from 'app/main/system/dashboards/model/dashboard.model';
import { DashboardDetailDataSource } from "app/main/system/dashboards/services/dashboard_detail.datasource";
import { DashboardDetailService } from 'app/main/system/dashboards/services/dashboard_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-dashboard-detail',
    templateUrl: './dashboard_detail.component.html',
    styleUrls: ['./dashboard_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DashboardDetailComponent implements OnInit, OnDestroy {
    dashboard_detail: any;
    public dashboard: any;
    pageType: string;
    userConncode: string;
    userID: number;
    dashboardObject_flag: boolean;
    dashboardForm: FormGroup;
    dashboardDetail: DashboardDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: DashboardDetailDataSource;
    dataSourcePrivType: DashboardDetailDataSource;
    dataSourcePrivObject: DashboardDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorPrivType: MatPaginator;
    @ViewChild('paginatorPrivObject', { read: MatPaginator }) paginatorPrivObject: MatPaginator;

    constructor(
        public dashboardDetailService: DashboardDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(dashboardsEnglish, dashboardsSpanish, dashboardsFrench, dashboardsPortuguese);
        this._unsubscribeAll = new Subject();
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {

            this.dashboard = data;
        });

        if (isEmpty(this.dashboard)) {
            this.dashboardDetailService.current_typeID = 0;
            this.dashboardObject_flag = false;
            this.pageType = 'new';
        } else {
            if (this.dashboard.typeid != 0) {
                this.dashboardDetailService.current_typeID = this.dashboard.typeid;
                this.dashboardObject_flag = true;
            } else {
                this.dashboardDetailService.current_typeID = 0;
            }
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourcePrivType = new DashboardDetailDataSource(this.dashboardDetailService);
        this.dataSourcePrivObject = new DashboardDetailDataSource(this.dashboardDetailService);
        this.dataSourcePrivType.loadDashboardDetail(0, 5, this.dashboard.type, "privtype_clist");
        if (this.dashboardObject_flag) {
            this.dataSourcePrivObject.loadDashboardDetail(0, 5, this.dashboard.object, "privobject_clist");
        }

        this.dashboardForm = this._formBuilder.group({
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
        this.dashboard_detail = this.dashboardForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorPrivType.page)
            .pipe(tap(() => { this.loadDashboardDetail("privtype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        if (this.dashboardObject_flag) {
            merge(this.paginatorPrivObject.page)
                .pipe(tap(() => { this.loadDashboardDetail('privobject') }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadDashboardDetail(method_string: string) {
        if (method_string == 'privtype') {
            this.dataSourcePrivType.loadDashboardDetail(this.paginatorPrivType.pageIndex, this.paginatorPrivType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'privobject') {
            this.dataSourcePrivObject.loadDashboardDetail(this.paginatorPrivObject.pageIndex, this.paginatorPrivObject.pageSize, this.filter_string, `${method_string}_clist`)
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
        let methodString = item;
        this.method_string = item.split('_')[0];
        if (this.method_string == 'privobject' && !this.dashboardObject_flag) {
            alert("Please select Type first!");
        } else {
            let selected_element_id = this.dashboardForm.get(`${this.method_string}`).value;
            let clist = this.dashboardDetailService.unit_clist_item[methodString];
            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.dashboardForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }
        }

        this.managePageIndex(this.method_string);
        this.loadDashboardDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.dashboardForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadDashboardDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadDashboardDetail(this.method_string);
        }
    }

    setValues() {
        this.dashboardForm.get('name').setValue(this.dashboard.name);
        this.dashboardForm.get('privtype').setValue(Number(this.dashboard.typeid));
        this.dashboardForm.get('privobject').setValue(Number(this.dashboard.objectid));
        let created = this.dashboard.created ? new Date(`${this.dashboard.created}`) : '';
        let deletedwhen = this.dashboard.deletedwhen ? new Date(`${this.dashboard.deletedwhen}`) : '';
        let lastmodifieddate = this.dashboard.lastmodifieddate ? new Date(`${this.dashboard.lastmodifieddate}`) : '';

        this.dashboardForm.get('created').setValue(this.dateFormat(created));
        this.dashboardForm.get('createdbyname').setValue(this.dashboard.createdbyname);
        this.dashboardForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.dashboardForm.get('deletedbyname').setValue(this.dashboard.deletedbyname);
        this.dashboardForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.dashboardForm.get('lastmodifiedbyname').setValue(this.dashboard.lastmodifiedbyname);
        this.dashboardForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.dashboardDetail.name = this.dashboardForm.get('name').value || '';
        this.dashboardDetail.typeid = this.dashboardForm.get('privtype').value || 0;
        this.dashboardDetail.objectid = this.dashboardForm.get('privobject').value || 0;
        this.dashboardDetail.isactive = this.dashboard.isactive || true;
        this.dashboardDetail.deletedwhen = this.dashboard.deletedwhen || '';
        this.dashboardDetail.deletedby = this.dashboard.deletedby || 0;

        if (mode == "save") {
            this.dashboardDetail.id = this.dashboard.id;
            this.dashboardDetail.created = this.dashboard.created;
            this.dashboardDetail.createdby = this.dashboard.createdby;
            this.dashboardDetail.lastmodifieddate = dateTime;
            this.dashboardDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.dashboardDetail.id = 0;
            this.dashboardDetail.created = dateTime;
            this.dashboardDetail.createdby = userID;
            this.dashboardDetail.lastmodifieddate = dateTime;
            this.dashboardDetail.lastmodifiedby = userID;
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

    saveDashboard(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.dashboardDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.dashboardDetailService.saveDashboardDetail(this.dashboardDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/dashboards/dashboards']);
                    }
                });
        }
    }

    addDashboard(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.dashboardDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.dashboardDetailService.saveDashboardDetail(this.dashboardDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/dashboards/dashboards']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.dashboardForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.dashboardForm.value;

        if (isEqual(this.dashboard_detail, currentState)) {
            this.router.navigate(['system/dashboards/dashboards']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { dashboard: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result) {
                    this.router.navigate(['system/dashboards/dashboards']);
                }
            });
        }
    }

    onTypeChange(event: any) {
        this.dashboardDetailService.current_typeID = this.dashboardForm.get('privtype').value;
        this.dashboardObject_flag = true;
        this.dataSourcePrivObject.loadDashboardDetail(0, 5, "", "privobject_clist");
    }

    checkTypeIsSelected() {
        alert("Please check first Type is selected!");
    }
}