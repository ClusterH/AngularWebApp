import { Component, NgZone, OnDestroy, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { TankDetail } from 'app/main/fuelmanagement/tanks/model/tank.model';
import { TankDetailService } from 'app/main/fuelmanagement/tanks/services/tank_detail.service';
import { TankDetailDataSource } from "app/main/fuelmanagement/tanks/services/tank_detail.datasource";

import { Observable, Subject, merge } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty } from 'lodash';

@Component({
    selector: 'fuelmanagement-tank-detail',
    templateUrl: './tank_detail_edit.component.html',
    styleUrls: ['./tank_detail_edit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class TankDetailEditComponent implements OnInit, OnDestroy {
    tank_detail: any;
    public tank: any;
    pageType: string;
    tankForm: FormGroup;
    tankDetail: TankDetail = {};
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    chart_data: any = [];
    dateOption = 'today';
    noData: boolean = true;
    fromDate: string = '';
    toDate: string = '';
    dataSourceCompany: TankDetailDataSource;
    dataSourceGroup: TankDetailDataSource;
    dataSourceVolumeUnit: TankDetailDataSource;
    dataSourceLevelUnit: TankDetailDataSource;
    dataSourceTempUnit: TankDetailDataSource;

    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorVolumeUnit', { read: MatPaginator }) paginatorVolumeUnit: MatPaginator;
    @ViewChild('paginatorLevelUnit', { read: MatPaginator }) paginatorLevelUnit: MatPaginator;
    @ViewChild('paginatorTempUnit', { read: MatPaginator }) paginatorTempUnit: MatPaginator;

    constructor(
        public tankDetailService: TankDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private zone: NgZone,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(tanksEnglish, tanksSpanish, tanksFrench, tanksPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.tank = data;
        });
        if (isEmpty(this.tank)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new TankDetailDataSource(this.tankDetailService);
        this.dataSourceGroup = new TankDetailDataSource(this.tankDetailService);
        this.dataSourceVolumeUnit = new TankDetailDataSource(this.tankDetailService);
        this.dataSourceLevelUnit = new TankDetailDataSource(this.tankDetailService);
        this.dataSourceTempUnit = new TankDetailDataSource(this.tankDetailService);

        this.dataSourceCompany.loadTankDetail(0, 10, this.tank.company, "company_clist");
        if (isEmpty(this.tank)) {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.tank.group, '0', "group_clist");
        } else {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.tank.group, this.tank.companyid, "group_clist");
        }
        this.dataSourceVolumeUnit.loadTankDetail(0, 10, this.tank.volumeunit, "fuelunit_clist");
        this.dataSourceLevelUnit.loadTankDetail(0, 10, this.tank.levelunit, "lengthunit_clist");
        this.dataSourceTempUnit.loadTankDetail(0, 10, this.tank.tempunit, "tempunit_clist");

        this.tankForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            group: [null],
            lastreport: [null, Validators.required],
            volume: [null, Validators.required],
            volumeunit: [null, Validators.required],
            level: [null, Validators.required],
            levelunit: [null, Validators.required],
            temp: [null, Validators.required],
            tempunit: [null, Validators.required],
            capacity: [null],
            isactive: [null],
            filterstring: [null]
        });

        this.setValues();
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadTankDetail("company"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadTankDetail("group"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
    }


    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadTankDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadTankDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.tankForm.get('company').value;
            if (companyid == undefined) {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, 0, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'fuelunit') {
            this.dataSourceVolumeUnit.loadTankDetail(0, 10, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'lengthunit') {
            this.dataSourceLevelUnit.loadTankDetail(0, 10, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'tempunit') {
            this.dataSourceTempUnit.loadTankDetail(0, 10, this.filter_string, `${method_string}_clist`)
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
            case 'fuelunit':
                this.paginatorVolumeUnit.pageIndex = 0;
                break;
            case 'lengthunit':
                this.paginatorLevelUnit.pageIndex = 0;
                break;
            case 'tempunit':
                this.paginatorTempUnit.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        console.log(this.tankDetailService.unit_clist_item);
        let methodString = item;
        this.method_string = item.split('_')[0];
        console.log(this.method_string);
        let selected_element_id = this.tankForm.get(`${this.method_string}`).value;
        let clist = this.tankDetailService.unit_clist_item[methodString];
        console.log(selected_element_id, 'clist===>>>', clist);
        let currentOptionID = clist.findIndex(item => item.id == selected_element_id);
        console.log(currentOptionID);
        this.tankForm.get('filterstring').setValue(clist[currentOptionID].name);
        this.filter_string = clist[currentOptionID].name;
        console.log(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadTankDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.tankForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadTankDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadTankDetail(this.method_string);
        }
    }

    compareFunction(o1: any, o2: any) {
        console.log(o1, o2);
        return (o1.name == o2.name && o1.id == o2.id);
    }

    onCompanyChange(event: any) {
        let current_companyID = this.tankForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }

    setValues() {
        let lastreport = this.tank.lastreport ? new Date(`${this.tank.lastreport}`) : '';
        console.log(lastreport);
        console.log('setValue===>>>', this.tank);
        this.tankForm.get('name').setValue(this.tank.name);
        this.tankForm.get('company').setValue(this.tank.companyid);
        this.tankForm.get('group').setValue(Number(this.tank.groupid));
        this.tankForm.get('volume').setValue(Number(this.tank.volume));
        this.tankForm.get('volumeunit').setValue(Number(this.tank.volumeunitid));
        this.tankForm.get('level').setValue(Number(this.tank.level));
        this.tankForm.get('levelunit').setValue(Number(this.tank.levelunitid));
        this.tankForm.get('temp').setValue(Number(this.tank.temp));
        this.tankForm.get('tempunit').setValue(Number(this.tank.tempunitid));
        this.tankForm.get('capacity').setValue(Number(this.tank.capacity));
        this.tankForm.get('lastreport').setValue((lastreport != '') ? this.tank.lastreport.slice(0, 16) : new Date('2020-01-01T00:00:00').toISOString().slice(0, 16));

        this.tankForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.tankDetail.name = this.tankForm.get('name').value || '';
        this.tankDetail.isactive = this.tank.isactive || true;
        this.tankDetail.companyid = this.tankForm.get('company').value || 0;
        this.tankDetail.groupid = this.tankForm.get('group').value || 0;
        this.tankDetail.lastreport = this.tankForm.get('lastreport').value + ':00';
        this.tankDetail.volumeunitid = this.tankForm.get('volumeunit').value || 0;
        this.tankDetail.levelunitid = this.tankForm.get('levelunit').value || 0;
        this.tankDetail.tempunitid = this.tankForm.get('tempunit').value || 0;
        this.tankDetail.volume = this.tankForm.get('volume').value || 0;
        this.tankDetail.level = this.tankForm.get('level').value || 0;
        this.tankDetail.temp = this.tankForm.get('temp').value || 0;
        this.tankDetail.hassensor = this.tank.hassensor || true;
        this.tankDetail.capacity = this.tankForm.get('capacity').value || 0;

        if (mode == "save") {
            this.tankDetail.id = this.tank.id;
            this.tankDetail.createdwhen = this.tank.createdwhen;
            this.tankDetail.createdby = this.tank.createdby;
            this.tankDetail.lastmodifieddate = dateTime;
            this.tankDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.tankDetail.id = 0;
            this.tankDetail.createdwhen = dateTime;
            this.tankDetail.createdby = userID;
            this.tankDetail.lastmodifieddate = dateTime;
            this.tankDetail.lastmodifiedby = userID;
        }
    }

    dateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear();

            if (date.getHours() < 12) {
                str = str + " "
                    + ("00" + date.getHours()).slice(-2) + ":"
                    + ("00" + date.getMinutes()).slice(-2)
                    + ":" + ("00" + date.getSeconds()).slice(-2) + " " + 'AM';
            } else {
                str = str + " "
                    + (date.getHours() - 12) + ":"
                    + ("00" + date.getMinutes()).slice(-2)
                    + ":" + ("00" + date.getSeconds()).slice(-2) + " " + 'PM';
            }
        }

        return str;
    }

    saveTank(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");

        if (this.tankDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            console.log(this.tankDetail);
            this.tankDetailService.saveTankDetail(this.tankDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['fuelmanagement/tanks/tanks']);
                }
            });
        }
    }

    addTank(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");

        if (this.tankDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.tankDetailService.saveTankDetail(this.tankDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['fuelmanagement/tanks/tanks']);
                }
            });
        }
    }

    goBackUnit() {
        const dialogConfig = new MatDialogConfig();
        let flag = 'goback';

        dialogConfig.disableClose = true;

        dialogConfig.data = {
            tank: "", flag: flag
        };

        dialogConfig.disableClose = false;

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {

            }
        });
    }
}
