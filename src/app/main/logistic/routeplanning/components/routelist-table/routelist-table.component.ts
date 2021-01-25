import { Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { locale as routeplanningEnglish } from 'app/main/logistic/routeplanning/i18n/en';
import { locale as routeplanningFrench } from 'app/main/logistic/routeplanning/i18n/fr';
import { locale as routeplanningPortuguese } from 'app/main/logistic/routeplanning/i18n/pt';
import { locale as routeplanningSpanish } from 'app/main/logistic/routeplanning/i18n/sp';
import { isEmpty } from 'lodash';

import { SetStartValuesDialogComponent } from "../../dialog/startvaluedialog/dialog.component";

import { JobList } from '../../model';
import { RoutePlanningRouteService, RoutePlanningStorageService } from '../../services';
@Component({
    selector: 'app-routelist-table',
    templateUrl: './routelist-table.component.html',
    styleUrls: ['./routelist-table.component.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class RoutelistTableComponent implements OnInit {
    @Input() dataSource: any[];
    @Input() selectedDate: Date;

    routecenter: any[];
    selectedRouteList: any[];
    totalRecords: number;
    loading: boolean = false;
    displayedColumns = ['unit', 'driver', 'route', 'fromto', 'start', 'delay'];
    displayedColumnsDetail = ['stop_client', 'time', 'arrived', 'leave', 'duration', 'eta', 'delay_detail'];
    stopList: any[];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private _unsubscribeAll: Subject<any>;

    @ViewChild('dt') table: Table;
    @Output() totalRoutesEmitter = new EventEmitter();
    @Output() isLoadedRoutesEmitter = new EventEmitter();

    constructor(
        public routePlanningRouteService: RoutePlanningRouteService,
        private routePlanningStorageService: RoutePlanningStorageService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private primengConfig: PrimeNGConfig,
        public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routeplanningEnglish, routeplanningSpanish, routeplanningFrench, routeplanningPortuguese);
    }

    ngOnInit(): void {
        this.routePlanningRouteService.loadingsubject.next(true);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // getRouteList(seldate: Date): void {
    //     this.routePlanningRouteService.getRoutePlanningRoute(1, 100000, 'id', 'asc', this.paramDateFormat(seldate), 'GetPlanningRoutes').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
    //
    //         if (res.responseCode == 100) {
    //             this.dataSource = JSON.parse(res.TrackingXLAPI.DATA[0].routes);
    //
    //             this.totalRecords = this.dataSource.length;

    //             if (this.totalRecords > 0) {
    //                 this.isLoadedRoutesEmitter.emit(true);
    //             } else {
    //                 this.isLoadedRoutesEmitter.emit(false);
    //             }
    //         } else {
    //             this.dataSource = [];
    //             this.totalRecords = 0;
    //         }

    //         this.routePlanningRouteService.loadingsubject.next(true);
    //         this.primengConfig.ripple = true;
    //         this.totalRoutesEmitter.emit(this.dataSource.length);
    //     });
    // }

    editRoute(route): void {

    }
    deleteRoute(route): void {

    }
    duplicateRoute(route): void {

    }

    isCheckRoute() {
        this.routePlanningStorageService.selectedRouteListSubject.next(this.selectedRouteList);
    }

    setStartValues(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'startValue-form-dialog';
        dialogConfig.data = this.selectedRouteList;
        const dialogRef = this._matDialog.open(SetStartValuesDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                // let deleteVehicle = this._adminVehiclesService.vehicleList.findIndex((deletedvehicle: any) => deletedvehicle.id == vehicle.id);
                // if (deleteVehicle > -1) {
                //     this._adminVehiclesService.vehicleList.splice(deleteVehicle, 1);
                //     this.dataSource.vehiclesSubject.next(this._adminVehiclesService.vehicleList);
                //     this.dataSource.totalLength = this.dataSource.totalLength - 1;
                // }
            }
        });
    }

    centerMapToStop(e: any) {
        this.routePlanningStorageService.clickedStopMoveToCenterSubject.next(e);
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
