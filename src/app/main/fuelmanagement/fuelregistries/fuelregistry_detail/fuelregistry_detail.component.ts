import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fuelregistriesEnglish } from 'app/main/fuelmanagement/fuelregistries/i18n/en';
import { locale as fuelregistriesFrench } from 'app/main/fuelmanagement/fuelregistries/i18n/fr';
import { locale as fuelregistriesPortuguese } from 'app/main/fuelmanagement/fuelregistries/i18n/pt';
import { locale as fuelregistriesSpanish } from 'app/main/fuelmanagement/fuelregistries/i18n/sp';
import { FuelregistryDetail } from 'app/main/fuelmanagement/fuelregistries/model/fuelregistry.model';
import { FuelregistryDetailDataSource } from "app/main/fuelmanagement/fuelregistries/services/fuelregistry_detail.datasource";
import { FuelregistryDetailService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistry_detail.service';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FuelRegisterDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-fuelregistry-detail',
    templateUrl: './fuelregistry_detail.component.html',
    styleUrls: ['./fuelregistry_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class FuelregistryDetailComponent implements OnInit, OnDestroy {
    fuelregistry_detail: any;
    public fuelregistry: any;
    pageType: string;
    userConncode: string;
    userID: number;
    userObject: any;
    fuelregistryModel_flag: boolean;
    fuelregistryForm: FormGroup;
    fuelregistryDetail: FuelregistryDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: FuelregistryDetailDataSource;
    dataSourceToUnit: FuelregistryDetailDataSource;
    dataSourceToTank: FuelregistryDetailDataSource;
    dataSourceFromTank: FuelregistryDetailDataSource;
    dataSourceOperator: FuelregistryDetailDataSource;
    dataSourceOdometerUnit: FuelregistryDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    registrytype: string;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorToUnit: MatPaginator;
    @ViewChild('paginatorToTank', { read: MatPaginator, static: true }) paginatorToTank: MatPaginator;
    @ViewChild('paginatorFromTank', { read: MatPaginator, static: true }) paginatorFromTank: MatPaginator;
    @ViewChild('paginatorOperator', { read: MatPaginator, static: true }) paginatorOperator: MatPaginator;

    constructor(
        public _fuelregistryDetailService: FuelregistryDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(fuelregistriesEnglish, fuelregistriesSpanish, fuelregistriesFrench, fuelregistriesPortuguese);
        this._unsubscribeAll = new Subject();
        this.userObject = JSON.parse(localStorage.getItem('userObjectList'))[0];
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.fuelregistry = data;
        });

        if (isEmpty(this.fuelregistry)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.registrytype = 'vehicle';
        let disabled = (this.registrytype == 'tank') ? true : false;
        this.dataSourceToUnit = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
        this.dataSourceToTank = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
        this.dataSourceFromTank = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
        this.dataSourceOperator = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
        this.dataSourceOdometerUnit = new FuelregistryDetailDataSource(this._fuelregistryDetailService);

        this.dataSourceToUnit.loadFuelregistryDetail(0, 10, this.fuelregistry.tounit, "unit_clist");
        this.dataSourceToTank.loadFuelregistryDetail(0, 10, this.fuelregistry.totank, "totank_clist");
        this.dataSourceFromTank.loadFuelregistryDetail(0, 10, this.fuelregistry.fromtank, "fromtank_clist");
        this.dataSourceOperator.loadFuelregistryDetail(0, 10, this.fuelregistry.operator, "operator_clist");
        this.dataSourceOdometerUnit.loadFuelregistryDetail(0, 10, '', "lengthunit_clist");

        this.fuelregistryForm = this._formBuilder.group({
            registrytype: [this.registrytype, Validators.required],
            tounit: [{ value: null, disabled: disabled }, Validators.required],
            totank: [{ value: null, disabled: !disabled }, Validators.required],
            fromtank: [null, Validators.required],
            amount: [null, Validators.required],
            fuelunit: [null, Validators.required],
            datentime: [null, Validators.required],
            odometer: [null, Validators.required],
            odometerunit: [null, Validators.required],
            cost: [null, Validators.required],
            operator: [null, Validators.required],
            filterstring: [null],
        });

        this.setValues();
        this.fuelregistry_detail = this.fuelregistryForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorToUnit.page)
            .pipe(tap(() => { this.loadFuelregistryDetail("tounit") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });

        merge(this.paginatorToTank.page)
            .pipe(tap(() => { this.loadFuelregistryDetail("totank") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });

        merge(this.paginatorFromTank.page)
            .pipe(tap(() => { this.loadFuelregistryDetail("fromtank") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });

        merge(this.paginatorOperator.page)
            .pipe(tap(() => { this.loadFuelregistryDetail("operator") }), takeUntil(this._unsubscribeAll)).subscribe(() => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadFuelregistryDetail(method_string: string) {
        if (method_string == 'tounit') {
            this.dataSourceToUnit.loadFuelregistryDetail(this.paginatorToUnit.pageIndex, this.paginatorToUnit.pageSize, this.filter_string, 'unit_clist')
        } else if (method_string == 'totank') {
            this.dataSourceToTank.loadFuelregistryDetail(this.paginatorToTank.pageIndex, this.paginatorToTank.pageSize, this.filter_string, 'totank_clist')
        } else if (method_string == 'fromtank') {
            this.dataSourceFromTank.loadFuelregistryDetail(this.paginatorFromTank.pageIndex, this.paginatorFromTank.pageSize, this.filter_string, 'fromtank_clist')
        } else if (method_string == 'operator') {
            this.dataSourceOperator.loadFuelregistryDetail(this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, 'operator_clist')
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'tounit':
                this.paginatorToUnit.pageIndex = 0;
                break;
            case 'totank':
                this.paginatorToTank.pageIndex = 0;
                break;
            case 'fromtank':
                this.paginatorFromTank.pageIndex = 0;
                break;
            case 'operator':
                this.paginatorOperator.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        const methodString = item;
        this.method_string = item.split('_')[0];

        if (this.registrytype == 'vehicle' && this.method_string == 'totank') {
            return;
        } else if (this.registrytype == 'tank' && this.method_string == 'unit') {
            return;
        } else {
            const selected_element_id = this.fuelregistryForm.get(`${this.method_string}`).value;
            const clist = this._fuelregistryDetailService.unit_clist_item[methodString];

            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.fuelregistryForm.get('filterstring').setValue(clist[i] ? clist[i].name : '');
                    this.filter_string = clist[i] ? clist[i].name : '';
                }
            }

            this.managePageIndex(this.method_string);
            this.loadFuelregistryDetail(this.method_string);
        }
    }

    clearFilter() {
        this.filter_string = '';
        this.fuelregistryForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadFuelregistryDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadFuelregistryDetail(this.method_string);
        }
    }

    setValues() {
        this.fuelregistryForm.get('registrytype').setValue(this.registrytype);
        this.fuelregistryForm.get('tounit').setValue(Number(this.fuelregistry.tounitid));
        this.fuelregistryForm.get('totank').setValue(Number(this.fuelregistry.totankid));
        this.fuelregistryForm.get('fromtank').setValue(Number(this.fuelregistry.fromtankid));
        this.fuelregistryForm.get('amount').setValue(this.fuelregistry.amount || 0);
        this.fuelregistryForm.get('fuelunit').setValue(this.fuelregistry.fuelunit || 'liters');
        this.fuelregistryForm.get('datentime').setValue((this.fuelregistry.datentime != '') ? this.fuelregistry.datentime.slice(0, 16) : new Date().toISOString().slice(0, 16));
        this.fuelregistryForm.get('odometer').setValue(this.fuelregistry.odometer);
        this.fuelregistryForm.get('odometerunit').setValue(this.userObject.lengthunitid);
        this.fuelregistryForm.get('cost').setValue(this.fuelregistry.cost || 0);
        this.fuelregistryForm.get('operator').setValue(Number(this.fuelregistry.operatorid));
        this.fuelregistryForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {

        this.fuelregistryDetail.tounitid = this.fuelregistryForm.get('tounit').value || '0';
        this.fuelregistryDetail.totankid = this.fuelregistryForm.get('totank').value || '0';
        this.fuelregistryDetail.fromtankid = this.fuelregistryForm.get('fromtank').value || '0';
        this.fuelregistryDetail.amount = this.fuelregistryForm.get('amount').value || '0';
        this.fuelregistryDetail.datentime = this.dateFormat(new Date(this.fuelregistryForm.get('datentime').value)) || '0';
        this.fuelregistryDetail.odometer = this.fuelregistryForm.get('odometer').value || '0';
        this.fuelregistryDetail.cost = this.fuelregistryForm.get('cost').value || '0';
        this.fuelregistryDetail.operatorid = this.fuelregistryForm.get('operator').value || '0';
        if (mode == "save") {
            this.fuelregistryDetail.id = this.fuelregistry.id;
        } else if (mode == "add") {
            this.fuelregistryDetail.id = 0;
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
        }
        return str;
    }

    savefuelregistry(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if ((this.fuelregistryDetail.tounitid == '0' && this.registrytype == 'vehicle') || this.fuelregistryDetail.fromtankid == '0') {
            alert('Please Choose ToUnit or FromTank')
        } else if ((this.fuelregistryDetail.totankid == '0' && this.registrytype == 'tank') || this.fuelregistryDetail.fromtankid == '0') {
            alert('Please Choose ToTank or FromTank')
        } else {
            this._fuelregistryDetailService.saveFuelregistryDetail(this.fuelregistryDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {

                    if (result.responseCode == 100) {
                        alert("Success!");
                        this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
                    }
                });
        }
    }

    addfuelregistry(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if ((this.fuelregistryDetail.tounitid == '0' && this.registrytype == 'vehicle') || this.fuelregistryDetail.fromtankid == '0') {
            alert('Please Choose ToUnit or FromTank')
        } else if ((this.fuelregistryDetail.totankid == '0' && this.registrytype == 'tank') || this.fuelregistryDetail.fromtankid == '0') {
            alert('Please Choose ToTank or FromTank')
        } else {
            this._fuelregistryDetailService.saveFuelregistryDetail(this.fuelregistryDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {

                    if (result.responseCode == 100) {
                        alert("Success!");
                        this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.fuelregistryForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.fuelregistryForm.value;

        if (isEqual(this.fuelregistry_detail, currentState)) {
            this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { fuelregistry: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(FuelRegisterDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
                }
            });
        }
    }

    onChangeRegistryType(event: any) {

        this.registrytype = event.value;
        if (this.registrytype == 'vehicle') {
            this.fuelregistryForm.controls.tounit.enable();
            this.fuelregistryForm.controls.totank.disable();
        } else {
            this.fuelregistryForm.controls.totank.enable();
            this.fuelregistryForm.controls.tounit.disable();
        }
    }
}