import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, ɵmarkDirty } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { VehicleDetail } from 'app/main/admin/vehicles/model/vehicle.model';
import { VehicleDetailDataSource } from "app/main/admin/vehicles/services/vehicle_detail.datasource";
import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-vehicle-detail',
    templateUrl: './vehicle_detail.component.html',
    styleUrls: ['./vehicle_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class VehicleDetailComponent implements OnInit, OnDestroy {
    vehicle_detail: any;
    public vehicle: any;
    pageType: string;
    vehicleModel_flag: boolean;
    vehicleForm: FormGroup;
    vehicleDetail: VehicleDetail = {};
    displayedColumns: string[] = ['name'];
    dataSourceCompany: VehicleDetailDataSource;
    dataSourceGroup: VehicleDetailDataSource;
    dataSourceAccount: VehicleDetailDataSource;
    dataSourceOperator: VehicleDetailDataSource;
    dataSourceUnitType: VehicleDetailDataSource;
    dataSourceServicePlan: VehicleDetailDataSource;
    dataSourceMake: VehicleDetailDataSource;
    dataSourceModel: VehicleDetailDataSource;
    dataSourceTimeZone: VehicleDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    routerLinkType: string;
    routerLinkValue: string;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorAccount', { read: MatPaginator, static: true }) paginatorAccount: MatPaginator;
    @ViewChild('paginatorOperator', { read: MatPaginator, static: true }) paginatorOperator: MatPaginator;
    @ViewChild('paginatorUnitType', { read: MatPaginator, static: true }) paginatorUnitType: MatPaginator;
    @ViewChild('paginatorServicePlan', { read: MatPaginator, static: true }) paginatorServicePlan: MatPaginator;
    @ViewChild('paginatorMake', { read: MatPaginator, static: true }) paginatorMake: MatPaginator;
    @ViewChild('paginatorModel', { read: MatPaginator }) paginatorModel: MatPaginator;
    @ViewChild('paginatorTimeZone', { read: MatPaginator, static: true }) paginatorTimeZone: MatPaginator;

    constructor(
        public vehicleDetailService: VehicleDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.vehicle = data;
        });

        this.activatedroute.paramMap.subscribe(params => {
            this.routerLinkType = params.get('type');
            switch (this.routerLinkType) {
                case '1':
                    this.routerLinkValue = 'Vehicle';
                    break;
                case '2':
                    this.routerLinkValue = 'Cargo';
                    break;
                case '3':
                    this.routerLinkValue = 'Person';
                    break;
                case '4':
                    this.routerLinkValue = 'Asset';
                    break;
            }



        });

        if (isEmpty(this.vehicle)) {
            this.vehicleDetailService.current_makeID = 0;
            this.vehicleModel_flag = false;
            this.pageType = 'new';
        } else {
            if (this.vehicle.makeid != 0) {
                this.vehicleDetailService.current_makeID = this.vehicle.makeid;
                this.vehicleModel_flag = true;
            } else { this.vehicleDetailService.current_makeID = 0; }
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceGroup = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceAccount = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceOperator = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceUnitType = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceServicePlan = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceMake = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceModel = new VehicleDetailDataSource(this.vehicleDetailService);
        this.dataSourceTimeZone = new VehicleDetailDataSource(this.vehicleDetailService);

        this.dataSourceCompany.loadVehicleDetail(0, 10, this.vehicle.company, "company_clist");
        if (isEmpty(this.vehicle)) {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.vehicle.group, '0', "group_clist");
        } else {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.vehicle.group, this.vehicle.companyid, "group_clist");
        }
        this.dataSourceAccount.loadVehicleDetail(0, 10, this.vehicle.account, "account_clist");
        this.dataSourceOperator.loadVehicleDetail(0, 10, this.vehicle.operator, "operator_clist");
        this.dataSourceUnitType.loadVehicleDetail(0, 10, this.vehicle.unittype, "unittype_clist");
        this.dataSourceServicePlan.loadVehicleDetail(0, 10, this.vehicle.serviceplan, "serviceplan_clist");
        this.dataSourceMake.loadVehicleDetail(0, 10, this.vehicle.make, "make_clist");
        if (this.vehicleModel_flag) {
            this.dataSourceModel.loadVehicleDetail(0, 10, this.vehicle.model, "model_clist");
        }
        this.dataSourceTimeZone.loadVehicleDetail(0, 10, this.vehicle.timezone, "timezone_clist");
        this.vehicleForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            group: [null, Validators.required],
            account: [null, Validators.required],
            operator: [null, Validators.required],
            unittype: [null, Validators.required],
            serviceplan: [null, Validators.required],
            producttypeVehicle: [{ value: this.routerLinkType === '1' ? this.routerLinkValue : '', disabled: true }],
            producttypeNoVehicle: [null, Validators.required],
            make: [null, Validators.required],
            model: [null, Validators.required],
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
        this.vehicle_detail = this.vehicleForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadVehicleDetail("company"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadVehicleDetail("group"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorAccount.page)
            .pipe(tap(() => { this.loadVehicleDetail("account"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorOperator.page)
            .pipe(tap(() => { this.loadVehicleDetail("operator"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorUnitType.page)
            .pipe(tap(() => { this.loadVehicleDetail("unittype"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorServicePlan.page)
            .pipe(tap(() => { this.loadVehicleDetail("serviceplan"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorMake.page)
            .pipe(tap(() => { this.loadVehicleDetail("make"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        merge(this.paginatorTimeZone.page)
            .pipe(tap(() => { this.loadVehicleDetail("timezone"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        if (this.vehicleModel_flag) {
            merge(this.paginatorModel.page)
                .pipe(tap(() => { this.loadVehicleDetail("model"), takeUntil(this._unsubscribeAll) })).subscribe((res: any) => { });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadVehicleDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadVehicleDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.vehicleForm.get('company').value;
            if (companyid == undefined) {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, 0, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'account') {
            this.dataSourceAccount.loadVehicleDetail(this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'operator') {
            this.dataSourceOperator.loadVehicleDetail(this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'unittype') {
            this.dataSourceUnitType.loadVehicleDetail(this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'serviceplan') {
            this.dataSourceServicePlan.loadVehicleDetail(this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'make') {
            this.dataSourceMake.loadVehicleDetail(this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'model') {
            this.dataSourceModel.loadVehicleDetail(this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'timezone') {
            this.dataSourceTimeZone.loadVehicleDetail(this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
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
        const methodString = item;
        this.method_string = item.split('_')[0];
        if (this.method_string == 'model' && !this.vehicleModel_flag) {
            alert("Please check first Make is selected!");
        } else {
            const selected_element_id = this.vehicleForm.get(`${this.method_string}`).value;
            const clist = this.vehicleDetailService.unit_clist_item[methodString];
            const currentOptionID = clist.findIndex(item => item.id == selected_element_id);

            this.vehicleForm.get('filterstring').setValue(clist[currentOptionID] ? clist[currentOptionID].name : '');
            this.filter_string = clist[currentOptionID] ? clist[currentOptionID].name : '';

            this.managePageIndex(this.method_string);
            this.loadVehicleDetail(this.method_string);
        }
    }

    clearFilter() {
        this.filter_string = '';
        this.vehicleForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadVehicleDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadVehicleDetail(this.method_string);
        }
    }

    setValues() {
        this.vehicleForm.get('name').setValue(this.vehicle.name);
        this.vehicleForm.get('company').setValue(Number(this.vehicle.companyid));
        this.vehicleForm.get('group').setValue(Number(this.vehicle.groupid));
        this.vehicleForm.get('account').setValue(Number(this.vehicle.accountid));
        this.vehicleForm.get('operator').setValue(Number(this.vehicle.operatorid));
        this.vehicleForm.get('unittype').setValue(Number(this.vehicle.unittypeid));
        this.vehicleForm.get('serviceplan').setValue(Number(this.vehicle.serviceplanid));
        this.vehicleForm.get('producttypeNoVehicle').setValue(Number(this.routerLinkType));
        this.vehicleForm.get('make').setValue(Number(this.vehicle.makeid));
        this.vehicleForm.get('model').setValue(Number(this.vehicle.modelid));
        this.vehicleForm.get('timezone').setValue(Number(this.vehicle.timezoneid));
        let created = this.vehicle.created ? new Date(`${this.vehicle.created}`) : '';
        let deletedwhen = this.vehicle.deletedwhen ? new Date(`${this.vehicle.deletedwhen}`) : '';
        let lastmodifieddate = this.vehicle.lastmodifieddate ? new Date(`${this.vehicle.lastmodifieddate}`) : '';
        this.vehicleForm.get('created').setValue(this.dateFormat(created));
        this.vehicleForm.get('createdbyname').setValue(this.vehicle.createdbyname);
        this.vehicleForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.vehicleForm.get('deletedbyname').setValue(this.vehicle.deletedbyname);
        this.vehicleForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.vehicleForm.get('lastmodifiedbyname').setValue(this.vehicle.lastmodifiedbyname);
        this.vehicleForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.vehicleDetail.name = this.vehicleForm.get('name').value || '';
        this.vehicleDetail.companyid = this.vehicleForm.get('company').value || 0;
        this.vehicleDetail.groupid = this.vehicleForm.get('group').value || 0;
        this.vehicleDetail.accountid = this.vehicleForm.get('account').value || 0;
        this.vehicleDetail.operatorid = this.vehicleForm.get('operator').value || 0;
        this.vehicleDetail.unittypeid = this.vehicleForm.get('unittype').value || 0;
        this.vehicleDetail.serviceplanid = this.vehicleForm.get('serviceplan').value || 0;
        this.vehicleDetail.producttypeid = this.routerLinkType === '1' ? this.routerLinkType : this.vehicleForm.get('producttype').value;
        this.vehicleDetail.makeid = this.vehicleForm.get('make').value || 0;
        this.vehicleDetail.modelid = this.vehicleForm.get('model').value || 0;
        this.vehicleDetail.timezoneid = this.vehicleForm.get('timezone').value || 0;
        this.vehicleDetail.subgroup = this.vehicle.subgroup || 0;
        this.vehicleDetail.isactive = this.vehicle.isactive || true;
        this.vehicleDetail.deletedwhen = this.vehicle.deletedwhen || '';
        this.vehicleDetail.deletedby = this.vehicle.deletedby || 0;
        if (mode == "edit") {
            this.vehicleDetail.id = this.vehicle.id;
            this.vehicleDetail.created = this.vehicle.created;
            this.vehicleDetail.createdby = this.vehicle.createdby;
            this.vehicleDetail.lastmodifieddate = dateTime;
            this.vehicleDetail.lastmodifiedby = userID;
        } else if (mode == "new") {
            this.vehicleDetail.id = '0';
            this.vehicleDetail.created = dateTime;
            this.vehicleDetail.createdby = userID;
            this.vehicleDetail.lastmodifieddate = dateTime;
            this.vehicleDetail.lastmodifiedby = userID;
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

    saveVehicle(): void {
        let today = new Date().toISOString();
        this.getValues(today, "edit");
        if (this.vehicleDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.vehicleDetailService.saveVehicleDetail(this.vehicleDetail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate([`admin/vehicles/vehicles/${this.routerLinkType}`]);
                    }
                });
        }
    }

    addVehicle(): void {
        let today = new Date().toISOString();
        this.getValues(today, "new");
        if (this.vehicleDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.vehicleDetailService.saveVehicleDetail(this.vehicleDetail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate([`admin/vehicles/vehicles/${this.routerLinkType}`]);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.vehicleForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.vehicleForm.value;

        if (isEqual(this.vehicle_detail, currentState)) {
            this.router.navigate([`admin/vehicles/vehicles/${this.routerLinkType}`]);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { vehicle: "", flag: flag };
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate([`admin/vehicles/vehicles/${this.routerLinkType}`]);
                }
            });
        }
    }

    onMakeChange(event: any) {
        this.vehicleDetailService.current_makeID = this.vehicleForm.get('make').value;
        this.vehicleModel_flag = true;
        this.dataSourceModel.loadVehicleDetail(0, 10, "", "model_clist");
    }

    onCompanyChange(event: any) {
        let current_companyID = this.vehicleForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }

    checkMakeIsSelected() {
        alert("Please check first Make is selected!");
    }
}