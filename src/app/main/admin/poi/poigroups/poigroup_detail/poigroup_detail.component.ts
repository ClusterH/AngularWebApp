import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as poigroupsEnglish } from 'app/main/admin/poi/poigroups/i18n/en';
import { locale as poigroupsFrench } from 'app/main/admin/poi/poigroups/i18n/fr';
import { locale as poigroupsPortuguese } from 'app/main/admin/poi/poigroups/i18n/pt';
import { locale as poigroupsSpanish } from 'app/main/admin/poi/poigroups/i18n/sp';
import { PoigroupDetail } from 'app/main/admin/poi/poigroups/model/poigroup.model';
import { PoigroupDetailDataSource } from "app/main/admin/poi/poigroups/services/poigroup_detail.datasource";
import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-poigroup-detail',
    templateUrl: './poigroup_detail.component.html',
    styleUrls: ['./poigroup_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class PoigroupDetailComponent implements OnInit {
    public poigroup: any;
    public poigroup_Temp: any;
    pageType: string;
    poigroupModel_flag: boolean;
    poigroupForm: FormGroup;
    poigroupDetail: PoigroupDetail = {};
    displayedColumns: string[] = ['name'];
    POIsColumns: string[] = ['id', 'name'];
    dataSource: PoigroupDetailDataSource;
    dataSourceCompany: PoigroupDetailDataSource;
    dataSourceIncluded: PoigroupDetailDataSource;
    dataSourceExcluded: PoigroupDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    currentTab: number;
    dialogRef: any;
    filterBy: boolean;
    includedSelection = new SelectionModel<Element>(true, []);
    excludedSelection = new SelectionModel<Element>(true, []);
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorIncluded', { read: MatPaginator, static: true }) paginatorIncluded: MatPaginator;
    @ViewChild('paginatorExcluded', { read: MatPaginator, static: true }) paginatorExcluded: MatPaginator;

    constructor(
        public poigroupDetailService: PoigroupDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseSidebarService: FuseSidebarService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(poigroupsEnglish, poigroupsSpanish, poigroupsFrench, poigroupsPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.poigroup = data;
        });

        if (isEmpty(this.poigroup)) {
            this.poigroupDetailService.current_poiGroupID = 0;
            this.pageType = 'new';
        } else {
            this.poigroupDetailService.current_poiGroupID = this.poigroup.id;
            this.pageType = 'edit';
        }

        this.filter_string = '';
        this.filterBy = true;
    }

    ngOnInit(): void {
        this.dataSourceCompany = new PoigroupDetailDataSource(this.poigroupDetailService);
        this.dataSourceIncluded = new PoigroupDetailDataSource(this.poigroupDetailService);
        this.dataSourceExcluded = new PoigroupDetailDataSource(this.poigroupDetailService);

        if (this.pageType == 'new') {
            this.dataSourceCompany.loadPoigroupDetail(0, 10, '', "company_clist");
        } else if (this.pageType == 'edit') {
            this.dataSourceIncluded.loadPoigroupDetail(0, 10, '', "GetGroupIncludedPOIs");
            this.dataSourceExcluded.loadPoigroupDetail(0, 10, '', "GetGroupExcludedPOIs");
        }

        this.poigroupForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            companyInput: [{ value: '', disabled: true }],
            isactive: [null],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });

        this.setValues();
        this.poigroup_Temp = this.poigroupForm.value;
    }

    ngAfterViewInit() {
        if (this, this.pageType == 'new') {
            merge(this.paginatorCompany.page)
                .pipe(tap(() => { this.loadPoigroupDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        }
        merge(this.paginatorIncluded.page)
            .pipe(tap(() => { this.loadPoigroupDetail("included") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorExcluded.page)
            .pipe(tap(() => { this.loadPoigroupDetail("excluded") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    loadPoigroupDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadPoigroupDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'included') {
            this.dataSourceIncluded.loadPoigroupDetail(this.paginatorIncluded.pageIndex, this.paginatorIncluded.pageSize, this.filter_string, "GetGroupIncludedPOIs")
        } else if (method_string == 'excluded') {
            this.dataSourceExcluded.loadPoigroupDetail(this.paginatorExcluded.pageIndex, this.paginatorExcluded.pageSize, this.filter_string, "GetGroupExcludedPOIs");
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
                break;
            case 'included':
                this.paginatorIncluded.pageIndex = 0;
                break;
            case 'excluded':
                this.paginatorExcluded.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.poigroupForm.get(`${this.method_string}`).value;
        let clist = this.poigroupDetailService.unit_clist_item[methodString];

        let currentOptionID = clist.findIndex(item => item.id == selected_element_id);
        this.poigroupForm.get('filterstring').setValue(clist[currentOptionID].name);
        this.filter_string = clist[currentOptionID].name;

        this.managePageIndex(this.method_string);
        this.loadPoigroupDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.poigroupForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadPoigroupDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadPoigroupDetail(this.method_string);
        }
    }

    onIncludedFilter(event: any) {
        this.method_string = 'included';
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadPoigroupDetail(this.method_string);
        }
    }

    onExcludedFilter(event: any) {
        this.method_string = 'excluded';
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadPoigroupDetail(this.method_string);
        }
    }

    setValues() {
        this.poigroupForm.get('name').setValue(this.poigroup.name);
        this.poigroupForm.get('company').setValue(Number(this.poigroup.companyid));
        this.poigroupForm.get('companyInput').setValue(this.poigroup.company);

        let created = this.poigroup.created ? new Date(`${this.poigroup.created}`) : '';
        let deletedwhen = this.poigroup.deletedwhen ? new Date(`${this.poigroup.deletedwhen}`) : '';
        let lastmodifieddate = this.poigroup.lastmodifieddate ? new Date(`${this.poigroup.lastmodifieddate}`) : '';

        this.poigroupForm.get('created').setValue(this.dateFormat(created));
        this.poigroupForm.get('createdbyname').setValue(this.poigroup.createdbyname);
        this.poigroupForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.poigroupForm.get('deletedbyname').setValue(this.poigroup.deletedbyname);
        this.poigroupForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.poigroupForm.get('lastmodifiedbyname').setValue(this.poigroup.lastmodifiedbyname);
        this.poigroupForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.poigroupDetail.name = this.poigroupForm.get('name').value || '';
        this.poigroupDetail.companyid = this.poigroupForm.get('company').value || 0;
        this.poigroupDetail.isactive = this.poigroup.isactive || true;
        this.poigroupDetail.deletedwhen = this.poigroup.deletedwhen || '';
        this.poigroupDetail.deletedby = this.poigroup.deletedby || 0;

        if (mode == "save") {
            this.poigroupDetail.id = this.poigroup.id;
            this.poigroupDetail.created = this.poigroup.created;
            this.poigroupDetail.createdby = this.poigroup.createdby;
            this.poigroupDetail.lastmodifieddate = dateTime;
            this.poigroupDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.poigroupDetail.id = 0;
            this.poigroupDetail.created = dateTime;
            this.poigroupDetail.createdby = userID;
            this.poigroupDetail.lastmodifieddate = dateTime;
            this.poigroupDetail.lastmodifiedby = userID;
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

    savePoigroup(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        this.poigroupDetailService.savePoigroupDetail(this.poigroupDetail).pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['admin/poi/poigroups/poigroups']);
                }
            });
    }

    addPoigroup(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        this.poigroupDetailService.savePoigroupDetail(this.poigroupDetail).pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['admin/poi/poigroups/poigroups']);
                }
            });
    }

    addPOIs() {
        if (this.pageType == 'new' && !this.poigroup.id) {
            let today = new Date().toISOString();
            this.getValues(today, "add");
            this.poigroupDetailService.savePoigroupDetail(this.poigroupDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if (result.responseCode == 100) {
                        let addData = [];
                        for (let i = 0; i < this.excludedSelection.selected.length; i++) {
                            addData[i] = {
                                poigroupid: Number(result.TrackingXLAPI.DATA[0].id),
                                poiid: Number(this.excludedSelection.selected[i])
                            }
                        }
                        this.poigroupDetailService.addPoiToGroup(addData).pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((res: any) => {
                                if (res.TrackingXLAPI.DATA) {
                                    alert("POIGroup added successfully!")
                                    this.router.navigate(['admin/poi/poigroups/poigroups']);
                                }
                            });
                    }
                });
        } else {
            let addData = [];
            for (let i = 0; i < this.excludedSelection.selected.length; i++) {
                addData[i] = {
                    poigroupid: Number(this.poigroup.id),
                    poiid: Number(this.excludedSelection.selected[i])
                }
            }
            this.poigroupDetailService.addPoiToGroup(addData).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (res.TrackingXLAPI.DATA) {
                        alert("POIs added successfully!");
                        this.dataSourceIncluded.loadPoigroupDetail(0, 10, '', "GetGroupIncludedPOIs");
                        this.dataSourceExcluded.loadPoigroupDetail(0, 10, '', "GetGroupExcludedPOIs");
                    }
                });
        }
    }

    deletePOIs() {
        let deleteData = [];
        for (let i = 0; i < this.includedSelection.selected.length; i++) {
            deleteData[i] = {
                poigroupid: Number(this.poigroup.id),
                poiid: Number(this.includedSelection.selected[i])
            }
        }
        this.poigroupDetailService.deletePoiToGroup(deleteData).pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (res.TrackingXLAPI.DATA) {
                    alert("POIs deleted successfully!");
                    this.dataSourceIncluded.loadPoigroupDetail(0, 10, '', "GetGroupIncludedPOIs");
                    this.dataSourceExcluded.loadPoigroupDetail(0, 10, '', "GetGroupExcludedPOIs");
                }
            });
    }

    getNewGroupPOIs(index: number) {
        if (index == 1) {
            this.filter_string = '';
            this.poigroupForm.get('filterstring').setValue(this.filter_string);
        }
        if (index == 1 && this.pageType == 'new') {
            this.filterBy = false;
            this.poigroupDetailService.current_CompanyID = this.poigroupForm.get('company').value || 0;
            if (this.poigroupDetailService.current_CompanyID == 0) {
                alert("Please choose company one first!");
                this.reloadComponent();
            } else {
                this.dataSourceIncluded.loadPoigroupDetail(0, 10, '', "GetGroupIncludedPOIs");
                this.dataSourceExcluded.loadPoigroupDetail(0, 10, '', "GetGroupExcludedPOIs");
            }
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.poigroupForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.poigroupForm.value;
        console.log(this.poigroup_Temp, currentState);
        if (isEqual(this.poigroup_Temp, currentState)) {
            this.router.navigate(['admin/poi/poigroups/poigroups']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { poigroup: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/poi/poigroups/poigroups']);
                }
            });
        }
    }

    changeFilter(filter) {
        this.filterBy = filter == 'included' ? true : false;
    }

    toggleSidebar(): void {
        this._fuseSidebarService.getSidebar('my-left-sidebar').toggleOpen();
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/poi/poigroups/poigroup_detail']);
    }
}
