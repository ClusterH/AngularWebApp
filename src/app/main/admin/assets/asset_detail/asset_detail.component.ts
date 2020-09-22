import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as assetsEnglish } from 'app/main/admin/assets/i18n/en';
import { locale as assetsFrench } from 'app/main/admin/assets/i18n/fr';
import { locale as assetsPortuguese } from 'app/main/admin/assets/i18n/pt';
import { locale as assetsSpanish } from 'app/main/admin/assets/i18n/sp';
import { AssetDetail } from 'app/main/admin/assets/model/asset.model';
import { AssetDetailDataSource } from "app/main/admin/assets/services/asset_detail.datasource";
import { AssetDetailService } from 'app/main/admin/assets/services/asset_detail.service';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-asset-detail',
    templateUrl: './asset_detail.component.html',
    styleUrls: ['./asset_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class AssetDetailComponent implements OnInit, OnDestroy {
    asset_detail: any;
    public asset: any;
    pageType: string;
    assetModel_flag: boolean;
    assetForm: FormGroup;
    assetDetail: AssetDetail = {};
    displayedColumns: string[] = ['name'];
    dataSourceCompany: AssetDetailDataSource;
    dataSourceGroup: AssetDetailDataSource;
    dataSourceAccount: AssetDetailDataSource;
    dataSourceOperator: AssetDetailDataSource;
    dataSourceUnitType: AssetDetailDataSource;
    dataSourceServicePlan: AssetDetailDataSource;
    dataSourceProductType: AssetDetailDataSource;
    dataSourceMake: AssetDetailDataSource;
    dataSourceModel: AssetDetailDataSource;
    dataSourceTimeZone: AssetDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorAccount', { read: MatPaginator, static: true }) paginatorAccount: MatPaginator;
    @ViewChild('paginatorOperator', { read: MatPaginator, static: true }) paginatorOperator: MatPaginator;
    @ViewChild('paginatorUnitType', { read: MatPaginator, static: true }) paginatorUnitType: MatPaginator;
    @ViewChild('paginatorServicePlan', { read: MatPaginator, static: true }) paginatorServicePlan: MatPaginator;
    @ViewChild('paginatorProductType', { read: MatPaginator, static: true }) paginatorProductType: MatPaginator;
    @ViewChild('paginatorMake', { read: MatPaginator, static: true }) paginatorMake: MatPaginator;
    @ViewChild('paginatorModel', { read: MatPaginator }) paginatorModel: MatPaginator;
    @ViewChild('paginatorTimeZone', { read: MatPaginator, static: true }) paginatorTimeZone: MatPaginator;

    constructor(
        public assetDetailService: AssetDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(assetsEnglish, assetsSpanish, assetsFrench, assetsPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.asset = data;
        });

        if (isEmpty(this.asset)) {
            this.assetDetailService.current_makeID = 0;
            this.assetModel_flag = false;
            this.pageType = 'new';
        } else {
            if (this.asset.makeid != 0) {
                this.assetDetailService.current_makeID = this.asset.makeid;
                this.assetModel_flag = true;
            } else { this.assetDetailService.current_makeID = 0; }
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceGroup = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceAccount = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceOperator = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceUnitType = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceServicePlan = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceProductType = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceMake = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceModel = new AssetDetailDataSource(this.assetDetailService);
        this.dataSourceTimeZone = new AssetDetailDataSource(this.assetDetailService);

        this.dataSourceCompany.loadAssetDetail(0, 10, this.asset.company, "company_clist");
        if (isEmpty(this.asset)) {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.asset.group, 0, "group_clist");
        } else {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.asset.group, this.asset.companyid, "group_clist");
        }
        this.dataSourceAccount.loadAssetDetail(0, 10, this.asset.account, "account_clist");
        this.dataSourceOperator.loadAssetDetail(0, 10, this.asset.operator, "operator_clist");
        this.dataSourceUnitType.loadAssetDetail(0, 10, this.asset.unittype, "unittype_clist");
        this.dataSourceServicePlan.loadAssetDetail(0, 10, this.asset.serviceplan, "serviceplan_clist");
        this.dataSourceProductType.loadAssetDetail(0, 10, '', "producttype_clist");
        this.dataSourceMake.loadAssetDetail(0, 10, this.asset.make, "make_clist");
        if (this.assetModel_flag) {
            this.dataSourceModel.loadAssetDetail(0, 10, this.asset.model, "model_clist");
        }
        this.dataSourceTimeZone.loadAssetDetail(0, 10, this.asset.timezone, "timezone_clist");
        this.assetForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            group: [null, Validators.required],
            subgroup: [null, Validators.required],
            account: [null, Validators.required],
            operator: [null, Validators.required],
            unittype: [null, Validators.required],
            serviceplan: [null, Validators.required],
            producttype: [null, Validators.required],
            make: [null, Validators.required],
            model: [null, Validators.required],
            isactive: [null, Validators.required],
            timezone: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });
        this.setValues();
        this.asset_detail = this.assetForm.value;

    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadAssetDetail("company"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadAssetDetail("group"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorAccount.page)
            .pipe(tap(() => { this.loadAssetDetail("account"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorOperator.page)
            .pipe(tap(() => { this.loadAssetDetail("operator"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorUnitType.page)
            .pipe(tap(() => { this.loadAssetDetail("unittype"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorServicePlan.page)
            .pipe(tap(() => { this.loadAssetDetail("serviceplan"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorProductType.page)
            .pipe(tap(() => { this.loadAssetDetail("producttype"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorMake.page)
            .pipe(tap(() => { this.loadAssetDetail("make"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorTimeZone.page)
            .pipe(tap(() => { this.loadAssetDetail("timezone"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        if (this.assetModel_flag) {
            merge(this.paginatorModel.page)
                .pipe(tap(() => { this.loadAssetDetail("model"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadAssetDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadAssetDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.assetForm.get('company').value;
            if (companyid == undefined) {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, 0, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'active') {
            this.dataSourceAccount.loadAssetDetail(this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'operator') {
            this.dataSourceOperator.loadAssetDetail(this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'unittype') {
            this.dataSourceUnitType.loadAssetDetail(this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'serviceplan') {
            this.dataSourceServicePlan.loadAssetDetail(this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'producttype') {
            this.dataSourceProductType.loadAssetDetail(this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, "", `${method_string}_clist`)
        } else if (method_string == 'make') {
            this.dataSourceMake.loadAssetDetail(this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'model') {
            this.dataSourceModel.loadAssetDetail(this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'timezone') {
            this.dataSourceTimeZone.loadAssetDetail(this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
                break;
            case 'account':
                this.paginatorAccount.pageIndex = 0;
                break;
            case 'group':
                this.paginatorGroup.pageIndex = 0;
                break;
            case 'operator':
                this.paginatorOperator.pageIndex = 0;
                break;
            case 'unittype':
                this.paginatorUnitType.pageIndex = 0;
                break;
            case 'serviceplan':
                this.paginatorServicePlan.pageIndex = 0;
                break;
            case 'producttype':
                this.paginatorProductType.pageIndex = 0;
                break;
            case 'make':
                this.paginatorMake.pageIndex = 0;
                break;
            case 'model':
                this.paginatorModel.pageIndex = 0;
                break;
            case 'timezone':
                this.paginatorTimeZone.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        if (this.method_string == 'model' && !this.assetModel_flag) {
            alert("Please check first Make is selected!");
        } else {
            let selected_element_id = this.assetForm.get(`${this.method_string}`).value;
            let clist = this.assetDetailService.unit_clist_item[methodString];
            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.assetForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }
            this.managePageIndex(this.method_string);
            this.loadAssetDetail(this.method_string);
        }
    }

    clearFilter() {
        this.filter_string = '';
        this.assetForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadAssetDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadAssetDetail(this.method_string);
        }
    }

    setValues() {
        console.log('setValue===>>>', this.asset);
        this.assetForm.get('name').setValue(this.asset.name);
        this.assetForm.get('company').setValue(Number(this.asset.companyid));
        this.assetForm.get('group').setValue(Number(this.asset.groupid));
        this.assetForm.get('account').setValue(Number(this.asset.accountid));
        this.assetForm.get('operator').setValue(Number(this.asset.operatorid));
        this.assetForm.get('unittype').setValue(Number(this.asset.unittypeid));
        this.assetForm.get('serviceplan').setValue(Number(this.asset.serviceplanid));
        this.assetForm.get('producttype').setValue(Number(this.asset.producttypeid));
        this.assetForm.get('make').setValue(Number(this.asset.makeid));
        this.assetForm.get('model').setValue(Number(this.asset.modelid));
        this.assetForm.get('timezone').setValue(Number(this.asset.timezoneid));
        let created = this.asset.created ? new Date(`${this.asset.created}`) : '';
        let deletedwhen = this.asset.deletedwhen ? new Date(`${this.asset.deletedwhen}`) : '';
        let lastmodifieddate = this.asset.lastmodifieddate ? new Date(`${this.asset.lastmodifieddate}`) : '';
        this.assetForm.get('created').setValue(this.dateFormat(created));
        this.assetForm.get('createdbyname').setValue(this.asset.createdbyname);
        this.assetForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.assetForm.get('deletedbyname').setValue(this.asset.deletedbyname);
        this.assetForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.assetForm.get('lastmodifiedbyname').setValue(this.asset.lastmodifiedbyname);
        this.assetForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.assetDetail.name = this.assetForm.get('name').value || '';
        this.assetDetail.companyid = this.assetForm.get('company').value || 0;
        this.assetDetail.groupid = this.assetForm.get('group').value || 0;
        this.assetDetail.accountid = this.assetForm.get('account').value || 0;
        this.assetDetail.operatorid = this.assetForm.get('operator').value || 0;
        this.assetDetail.unittypeid = this.assetForm.get('unittype').value || 0;
        this.assetDetail.serviceplanid = this.assetForm.get('serviceplan').value || 0;
        this.assetDetail.producttypeid = this.assetForm.get('producttype').value || 0;
        this.assetDetail.makeid = this.assetForm.get('make').value || 0;
        this.assetDetail.modelid = this.assetForm.get('model').value || 0;
        this.assetDetail.timezoneid = this.assetForm.get('timezone').value || 0;
        this.assetDetail.subgroup = this.asset.subgroup || 0;
        this.assetDetail.isactive = this.asset.isactive || true;
        this.assetDetail.deletedwhen = this.asset.deletedwhen || '';
        this.assetDetail.deletedby = this.asset.deletedby || 0;
        if (mode == "save") {
            this.assetDetail.id = this.asset.id;
            this.assetDetail.created = this.asset.created;
            this.assetDetail.createdby = this.asset.createdby;
            this.assetDetail.lastmodifieddate = dateTime;
            this.assetDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.assetDetail.id = 0;
            this.assetDetail.created = dateTime;
            this.assetDetail.createdby = userID;
            this.assetDetail.lastmodifieddate = dateTime;
            this.assetDetail.lastmodifiedby = userID;
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

    saveAsset(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.assetDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.assetDetailService.saveAssetDetail(this.assetDetail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/assets/assets']);
                    }
                });
        }
    }

    addAsset(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.assetDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.assetDetailService.saveAssetDetail(this.assetDetail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/assets/assets']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.assetForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.assetForm.value;
        if (isEqual(this.asset_detail, currentState)) {
            this.router.navigate(['admin/assets/assets']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { asset: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/assets/assets']);
                }
            });
        }
    }

    onMakeChange(event: any) {
        this.assetDetailService.current_makeID = this.assetForm.get('make').value;
        this.assetModel_flag = true;
        this.dataSourceModel.loadAssetDetail(0, 10, "", "model_clist");
    }

    onCompanyChange(event: any) {
        let current_companyID = this.assetForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }

    checkMakeIsSelected() {
        alert("Please check first Make is selected!");
    }
}