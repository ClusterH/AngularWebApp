import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as zonesEnglish } from 'app/main/admin/geofences/zones/i18n/en';
import { locale as zonesFrench } from 'app/main/admin/geofences/zones/i18n/fr';
import { locale as zonesPortuguese } from 'app/main/admin/geofences/zones/i18n/pt';
import { locale as zonesSpanish } from 'app/main/admin/geofences/zones/i18n/sp';
import { ZoneDetail } from 'app/main/admin/geofences/zones/model/zone.model';
import { ZoneDetailDataSource } from "app/main/admin/geofences/zones/services/zone_detail.datasource";
import { ZoneDetailService } from 'app/main/admin/geofences/zones/services/zone_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-zone-detail',
    templateUrl: './zone_detail.component.html',
    styleUrls: ['./zone_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ZoneDetailComponent implements OnInit {
    zone_detail: any;
    public zone: any;
    pageType: string;
    userConncode: string;
    userID: number;
    zoneModel_flag: boolean;
    zoneForm: FormGroup;
    zoneDetail: ZoneDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: ZoneDetailDataSource;
    dataSourceCompany: ZoneDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorCompany: MatPaginator;

    constructor(
        public zoneDetailService: ZoneDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(zonesEnglish, zonesSpanish, zonesFrench, zonesPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.zone = data;
        });
        if (isEmpty(this.zone)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new ZoneDetailDataSource(this.zoneDetailService);
        this.dataSourceCompany.loadZoneDetail(0, 10, this.zone.company, "company_clist");
        this.zoneForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null, Validators.required],
        });

        this.setValues();
        this.zone_detail = this.zoneForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => {
                this.loadZoneDetail("company")
            }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadZoneDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadZoneDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`);
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
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.zoneForm.get(`${this.method_string}`).value;
        let clist = this.zoneDetailService.unit_clist_item[methodString];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.zoneForm.get('filterstring').setValue(clist[i] ? clist[i].name : '');
                this.filter_string = clist[i] ? clist[i].name : '';
            }
        }

        this.managePageIndex(this.method_string);
        this.loadZoneDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.zoneForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadZoneDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadZoneDetail(this.method_string);
        }
    }

    setValues() {
        this.zoneForm.get('name').setValue(this.zone.name);
        this.zoneForm.get('company').setValue(this.zone.companyid);
        let created = this.zone.created ? new Date(`${this.zone.created}`) : '';
        let deletedwhen = this.zone.deletedwhen ? new Date(`${this.zone.deletedwhen}`) : '';
        let lastmodifieddate = this.zone.lastmodifieddate ? new Date(`${this.zone.lastmodifieddate}`) : '';

        this.zoneForm.get('created').setValue(this.dateFormat(created));
        this.zoneForm.get('createdbyname').setValue(this.zone.createdbyname);
        this.zoneForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.zoneForm.get('deletedbyname').setValue(this.zone.deletedbyname);
        this.zoneForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.zoneForm.get('lastmodifiedbyname').setValue(this.zone.lastmodifiedbyname);
        this.zoneForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.zoneDetail.name = this.zoneForm.get('name').value || '';
        this.zoneDetail.companyid = this.zoneForm.get('company').value || 0;
        this.zoneDetail.isactive = this.zone.isactive || true;
        this.zoneDetail.deletedwhen = this.zone.deletedwhen || '';
        this.zoneDetail.deletedby = this.zone.deletedby || 0;

        if (mode == "save") {
            this.zoneDetail.id = this.zone.id;
            this.zoneDetail.created = this.zone.created;
            this.zoneDetail.createdby = this.zone.createdby;
            this.zoneDetail.lastmodifieddate = dateTime;
            this.zoneDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.zoneDetail.id = 0;
            this.zoneDetail.created = dateTime;
            this.zoneDetail.createdby = userID;
            this.zoneDetail.lastmodifieddate = dateTime;
            this.zoneDetail.lastmodifiedby = userID;
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

    saveZone(): void {
        const today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.zoneDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.zoneDetailService.saveZoneDetail(this.zoneDetail)
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/geofences/zones/zones']);
                    }
                });
        }
    }

    addZone(): void {
        const today = new Date().toISOString();
        this.getValues(today, "add");

        if (this.zoneDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.zoneDetailService.saveZoneDetail(this.zoneDetail)
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/geofences/zones/zones']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.zoneForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.zoneForm.value;
        if (isEqual(this.zone_detail, currentState)) {
            this.router.navigate(['admin/vehicles/vehicles']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = {
                zone: "", flag: flag
            };

            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/vehicles/vehicles']);
                }
            });
        }
    }
}