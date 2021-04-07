import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { CompanyDataSource } from '../../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as mapEnglish } from 'app/main/home/maps/i18n/en';
import { locale as mapFrench } from 'app/main/home/maps/i18n/en';
import { locale as mapPortuguese } from 'app/main/home/maps/i18n/en';
import { locale as mapSpanish } from 'app/main/home/maps/i18n/en';

import { ZonesService } from '../../services';
import { ZoneDetail } from '../../models';

@Component({
    selector: 'contractor-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateZoneDialogComponent implements OnInit, OnDestroy {
    zoneDetail: ZoneDetail = {};
    zoneForm: FormGroup;
    dataSourceCompany: CompanyDataSource;
    dataSourceGroup: CompanyDataSource;

    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    isCompanyLoaded: boolean = false;
    @ViewChild(MatPaginator, { static: true })
    paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;


    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<CreateZoneDialogComponent>,
        private zonesService: ZonesService
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(mapEnglish, mapSpanish, mapFrench, mapPortuguese);
        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceCompany = new CompanyDataSource(this.zonesService);
        this.dataSourceGroup = new CompanyDataSource(this.zonesService);

        this.dataSourceCompany.loadCompanyList(0, 10, '');
        this.dataSourceGroup.loadGroupList(0, 10, '', '0');

        this.zoneForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            group: [null, Validators.required],
            filterstring: ['']
        });

        // this.setValues();
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page).pipe(tap(() => { this.loadCompanyDetail() }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        if (this.isCompanyLoaded) {
            merge(this.paginatorGroup.page)
                .pipe(tap(() => { this.loadGroupDetail(), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getValue() {
        const userID: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const today = new Date().toISOString();

        this.zoneDetail.id = 0;
        this.zoneDetail.name = this.zoneForm.get('name').value || '';
        this.zoneDetail.companyid = this.zoneForm.get('company').value || 0;
        this.zoneDetail.groupid = this.zoneForm.get('group').value || 0;
        this.zoneDetail.isactive = true;
        this.zoneDetail.created = today;
        this.zoneDetail.createdby = userID;
        this.zoneDetail.lastmodifieddate = today;
        this.zoneDetail.lastmodifiedby = userID;
    }

    loadCompanyDetail() {
        this.dataSourceCompany.loadCompanyList(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string)
    }

    loadGroupDetail() {
        const companyid = this.zoneForm.get('company').value;
        if (!companyid) {
            this.dataSourceGroup.loadGroupList(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, '0');
        } else {
            this.dataSourceGroup.loadGroupList(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid);
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
        }
    }

    showCompanyList(method: string) {
        this.method_string = method;

        if (method === 'company') {
            const selected_element_id = this.zoneForm.get('company').value;
            const clist = this.zonesService.currentCompanyClist;
            clist.map(item => {
                if (item.id === selected_element_id) {
                    this.zoneForm.get('filterstring').setValue(item ? item.name : '');
                    this.filter_string = item ? item.name : '';
                }
            })

            this.managePageIndex(method);
            this.loadCompanyDetail();
        } else if (method === 'group') {
            // if (!this.isCompanyLoaded) {
            //     alert("Please check first Company is selected!");
            //     return
            // }

            const selected_element_id = this.zoneForm.get('group').value;
            const clist = this.zonesService.currentGroupClist;
            clist.map(item => {
                if (item.id === selected_element_id) {
                    this.zoneForm.get('filterstring').setValue(item ? item.name : '');
                    this.filter_string = item ? item.name : '';
                }
            })

            this.managePageIndex(method);
            this.loadGroupDetail();
        }

    }

    clearFilter() {
        this.filter_string = '';
        this.zoneForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);

        if (this.method_string === 'company') {
            this.loadCompanyDetail();
        } else if (this.method_string === 'group') {
            this.loadGroupDetail();
        }
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            if (this.method_string === 'company') {
                this.loadCompanyDetail();
            } else if (this.method_string === 'group') {
                this.loadGroupDetail();
            }
        }
    }

    companyPagenation(paginator) {
        this.dataSourceCompany.loadCompanyList(paginator.pageIndex, paginator.pageSize, this.filter_string);
    }

    // groupPagenation(paginator) {
    //     this.dataSourceGroup.loadGroupList(paginator.pageIndex, paginator.pageSize, this.filter_string);
    // }

    onCompanyChange(event: any) {
        let current_companyID = this.zoneForm.get('company').value;
        this.dataSourceGroup.loadGroupList(0, 10, "", current_companyID);
    }

    addZone() {
        this.getValue();
        this.zonesService.saveZoneDetail(this.zoneDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            if (res.responseCode === 100) {
                this.dialogRef.close(res.TrackingXLAPI.DATA[0].id);
            } else {
                alert('Failed adding!');
            }
        });
    }
    close() {
        this.dialogRef.close();
    }
}