import { Component, OnInit, ViewChild, Output, ViewEncapsulation, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { locale as routeplanningEnglish } from 'app/main/logistic/routeplanning/i18n/en';
import { locale as routeplanningFrench } from 'app/main/logistic/routeplanning/i18n/fr';
import { locale as routeplanningPortuguese } from 'app/main/logistic/routeplanning/i18n/pt';
import { locale as routeplanningSpanish } from 'app/main/logistic/routeplanning/i18n/sp';
import { isEmpty } from 'lodash';

import { SetStartValuesDialogComponent } from "../../dialog/startvaluedialog/dialog.component";
import { DriverListDialogComponent } from '../../dialog/driverlist-dialog/dialog.component';
import { JobList } from '../../model';
import { RoutePlanningDriverService } from '../../services';

@Component({
    selector: 'routeplanning-driverlist-table',
    templateUrl: './driverlist-table.component.html',
    styleUrls: ['./driverlist-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class DriverlistTableComponent implements OnInit {
    dataSource$: Observable<any[]>;
    driverList: any[];
    selectedDriverList: any[];
    totalRecords: number;
    loading: boolean = false;
    displayedColumns = ['driver', 'startlocation', 'starttime', 'endtime', 'latitude', 'longitude'];
    faIncludedIcon = faSignOutAlt;
    faExcludedIcon = faSignInAlt;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private _unsubscribeAll: Subject<any>;

    @ViewChild('dt') table: Table;
    @Input() selectedDate: Date;
    @Output() totalDriversEmitter = new EventEmitter();

    constructor(
        public routePlanningDriverService: RoutePlanningDriverService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private primengConfig: PrimeNGConfig,
        public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routeplanningEnglish, routeplanningSpanish, routeplanningFrench, routeplanningPortuguese);
    }

    ngOnInit(): void {
        this.getDriverList(this.selectedDate);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    applyFilterGlobal($event, stringVal) {
        this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getDriverList(seldate: Date): void {
        this.routePlanningDriverService.loadingsubject.next(false);
        this.routePlanningDriverService.getRoutePlanningDriver(1, 100000, 'driver', 'asc', this.paramDateFormat(seldate), 'routeplanningdrivers_TList').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.driverList = [...res.TrackingXLAPI.DATA];
            this.dataSource$ = of(res.TrackingXLAPI.DATA);
            this.totalRecords = res.TrackingXLAPI.DATA.length;
            this.routePlanningDriverService.loadingsubject.next(true);
            this.primengConfig.ripple = true;
            this.totalDriversEmitter.emit(this.totalRecords);
        });
    }

    editDriver(driver): void {

        this.selectedDriverList = [];
        this.selectedDriverList.push(driver);
        this.setStartValues();
    }

    deleteDriver(driver): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.data = { driver, flag: 'delete', seldate: this.paramDateFormat(this.selectedDate) };
        const dialogRef = this._matDialog.open(DriverListDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {

                let deleteDriver = this.driverList.findIndex((deletedjob: JobList) => deletedjob.id == driver.id);
                if (deleteDriver > -1) {
                    this.driverList.splice(deleteDriver, 1);
                    this.totalRecords = this.driverList.length;
                    this.totalDriversEmitter.emit(this.totalRecords);
                    this.dataSource$ = of(this.driverList);
                }
            }
        });
    }

    setDriverInclude(driver): void {
        let changedDriver = { ...driver };
        changedDriver.include = !changedDriver.include;
        this.driverList[this.findIndexById(changedDriver.id)] = changedDriver;
        this.routePlanningDriverService.setDriverInclude(driver.id, driver.include ? 0 : 1, this.paramDateFormat(this.selectedDate)).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.driverList = [...this.driverList];
            this.dataSource$ = of(this.driverList);
        });
        this.driverList = [...this.driverList];
        this.dataSource$ = of(this.driverList);
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.driverList.length; i++) {
            if (this.driverList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    setStartValues(): void {
        if (isEmpty(this.selectedDriverList)) {
            return;
        }
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'startValue-form-dialog';
        dialogConfig.data = this.selectedDriverList;
        const dialogRef = this._matDialog.open(SetStartValuesDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let selectedIdTemp = this.selectedDriverList.map(item => {
                    return item.id;
                });
                let selectedDriverIdTemp = this.selectedDriverList.map(item => {
                    return item.driverid;
                });
                let setStartValues = { ...result, driverids: selectedIdTemp.join(), seldate: this.paramDateFormat(this.selectedDate) };

                this.routePlanningDriverService.setDriverStartTimeAndPlace(setStartValues).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

                });
            }
        });
    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
            str = date.getFullYear()
                + "/" + ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
        }


        return str;
    }
}
