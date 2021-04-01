import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as poisEnglish } from 'app/main/admin/poi/pois/i18n/en';
import { locale as poisFrench } from 'app/main/admin/poi/pois/i18n/fr';
import { locale as poisPortuguese } from 'app/main/admin/poi/pois/i18n/pt';
import { locale as poisSpanish } from 'app/main/admin/poi/pois/i18n/sp';
import { PoiDetail } from 'app/main/admin/poi/pois/model/poi.model';
import { PoiDetailDataSource } from "app/main/admin/poi/pois/services/poi_detail.datasource";
import { PoiDetailService } from 'app/main/admin/poi/pois/services/poi_detail.service';
import { isEmpty, isEqual } from 'lodash';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-poi-detail',
    templateUrl: './poi_detail.component.html',
    styleUrls: ['./poi_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class PoiDetailComponent implements OnInit, OnDestroy {
    poi_detail: any;
    public poi: any;
    pageType: string;
    routerLinkType: string;

    poiModel_flag: boolean;
    poiForm: FormGroup;
    poiDetail: PoiDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: PoiDetailDataSource;
    dataSourceCompany: PoiDetailDataSource;
    dataSourceGroup: PoiDetailDataSource;
    dataSourcePoint: PoiDetailDataSource;
    dataSourcePointType: PoiDetailDataSource;

    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator, static: true }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorPoint', { read: MatPaginator, static: true }) paginatorPoint: MatPaginator;
    @ViewChild('paginatorPointType', { read: MatPaginator, static: true }) paginatorPointType: MatPaginator;

    constructor(
        public poiDetailService: PoiDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(poisEnglish, poisSpanish, poisFrench, poisPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.poi = data;
        });
        this.activatedroute.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
            this.routerLinkType = params.get('type');
        })


        if (isEmpty(this.poi)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new PoiDetailDataSource(this.poiDetailService);
        this.dataSourceGroup = new PoiDetailDataSource(this.poiDetailService);
        this.dataSourcePoint = new PoiDetailDataSource(this.poiDetailService);
        this.dataSourcePointType = new PoiDetailDataSource(this.poiDetailService);

        this.dataSourceCompany.loadPoiDetail(0, 10, this.poi.company, "company_clist");
        if (isEmpty(this.poi)) {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.poi.group, 0, "group_clist");
        } else {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.poi.group, this.poi.companyid, "group_clist");
        }
        this.dataSourcePoint.loadPoiDetail(0, 10, this.poi.point, "point_clist");
        this.dataSourcePointType.loadPoiDetail(0, 10, this.poi.pointtype, "pointtype_clist");

        this.poiForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            group: [null, Validators.required],
            subgroup: [null, Validators.required],
            point: [null, Validators.required],
            pointtype: [null, Validators.required],
            address: [null, Validators.required],
            longitude: [null, Validators.required],
            latitude: [null, Validators.required],
            radius: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });
        this.setValues();
        this.poi_detail = this.poiForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadPoiDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadPoiDetail("group") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorPoint.page)
            .pipe(tap(() => { this.loadPoiDetail("point") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorPointType.page)
            .pipe(tap(() => { this.loadPoiDetail("pointtype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadPoiDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadPoiDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.poiForm.get('company').value;
            if (companyid == undefined) {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, 0, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'point') {
            this.dataSourcePoint.loadPoiDetail(this.paginatorPoint.pageIndex, this.paginatorPoint.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'pointtype') {
            this.dataSourcePointType.loadPoiDetail(this.paginatorPointType.pageIndex, this.paginatorPointType.pageSize, this.filter_string, `${method_string}_clist`)
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
            case 'point':
                this.paginatorPoint.pageIndex = 0;
                break;
            case 'pointtype':
                this.paginatorPointType.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.poiForm.get(`${this.method_string}`).value;
        let clist = this.poiDetailService.unit_clist_item[methodString];
        let currentOptionID = clist.findIndex(item => item.id == selected_element_id);
        this.poiForm.get('filterstring').setValue(clist[currentOptionID] ? clist[currentOptionID].name : '');
        this.filter_string = clist[currentOptionID] ? clist[currentOptionID].name : '';
        this.managePageIndex(this.method_string);
        this.loadPoiDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.poiForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadPoiDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadPoiDetail(this.method_string);
        }
    }

    setValues() {
        this.poiForm.get('name').setValue(this.poi.name);
        this.poiForm.get('company').setValue(Number(this.poi.companyid));
        this.poiForm.get('group').setValue(Number(this.poi.groupid));
        this.poiForm.get('radius').setValue(this.poi.radius);
        this.poiForm.get('point').setValue(Number(this.poi.pointid));
        this.poiForm.get('pointtype').setValue(Number(this.poi.pointtypeid));
        this.poiForm.get('address').setValue(this.poi.address);
        this.poiForm.get('latitude').setValue(this.poi.latitude);
        this.poiForm.get('longitude').setValue(this.poi.longitude);

        let created = this.poi.created ? new Date(`${this.poi.created}`) : '';
        let deletedwhen = this.poi.deletedwhen ? new Date(`${this.poi.deletedwhen}`) : '';
        let lastmodifieddate = this.poi.lastmodifieddate ? new Date(`${this.poi.lastmodifieddate}`) : '';

        this.poiForm.get('created').setValue(this.dateFormat(created));
        this.poiForm.get('createdbyname').setValue(this.poi.createdbyname);
        this.poiForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.poiForm.get('deletedbyname').setValue(this.poi.deletedbyname);
        this.poiForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.poiForm.get('lastmodifiedbyname').setValue(this.poi.lastmodifiedbyname);
        this.poiForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.poiDetail.name = this.poiForm.get('name').value || '';
        this.poiDetail.companyid = this.poiForm.get('company').value || 0;
        this.poiDetail.groupid = this.poiForm.get('group').value || 0;
        this.poiDetail.pointid = this.poiForm.get('point').value || 0;
        this.poiDetail.pointtypeid = this.poiForm.get('pointtype').value || 0;
        this.poiDetail.radius = this.poiForm.get('radius').value || 0;
        this.poiDetail.address = this.poiForm.get('address').value || '';
        this.poiDetail.latitude = this.poiForm.get('latitude').value || 0;
        this.poiDetail.longitude = this.poiForm.get('longitude').value || 0;

        this.poiDetail.subgroup = this.poi.subgroup || 0;
        this.poiDetail.isactive = this.poi.isactive || true;
        this.poiDetail.deletedwhen = this.poi.deletedwhen || '';
        this.poiDetail.deletedby = this.poi.deletedby || 0;

        if (mode == "save") {
            this.poiDetail.id = this.poi.id;
            this.poiDetail.created = this.poi.created;
            this.poiDetail.createdby = this.poi.createdby;
            this.poiDetail.lastmodifieddate = dateTime;
            this.poiDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.poiDetail.id = 0;
            this.poiDetail.created = dateTime;
            this.poiDetail.createdby = userID;
            this.poiDetail.lastmodifieddate = dateTime;
            this.poiDetail.lastmodifiedby = userID;
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

    savePoi(): void {
        const today = new Date().toISOString();
        this.getValues(today, "save");
        this.poiDetailService.savePoiDetail(this.poiDetail)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    if (this.routerLinkType == 'origin') {
                        this.router.navigate(['admin/poi/pois/pois']);
                    } else if (this.routerLinkType == 'map') {
                        this.router.navigate(['home/google/saved'], { queryParams: this.poiDetail });
                    }
                }
            });
    }

    addPoi(): void {
        const today = new Date().toISOString();
        this.getValues(today, "add");
        this.poiDetailService.savePoiDetail(this.poiDetail)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['admin/poi/pois/pois']);
                }
            });
    }

    goBackUnit() {
        this.filter_string = '';
        this.poiForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.poiForm.value;

        if (isEqual(this.poi_detail, currentState)) {
            if (this.routerLinkType == 'origin') {
                this.router.navigate(['admin/poi/pois/pois']);
            } else if (this.routerLinkType == 'map') {
                this.router.navigate(['home/google/unsaved'], { queryParams: this.poi });
            }
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { poi: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    if (this.routerLinkType == 'origin') {
                        this.router.navigate(['admin/poi/pois/pois']);
                    } else if (this.routerLinkType == 'map') {
                        this.router.navigate(['home/google/unsaved'], { queryParams: this.poi });
                    }
                }
            });
        }
    }
    onCompanyChange(event: any) {
        let current_companyID = this.poiForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }
}