import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

import { AgmMap, AgmMarker, LatLngBounds, MapsAPILoader, MouseEvent } from '@agm/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routeplanningEnglish } from 'app/main/logistic/routeplanning/i18n/en';
import { locale as routeplanningFrench } from 'app/main/logistic/routeplanning/i18n/fr';
import { locale as routeplanningPortuguese } from 'app/main/logistic/routeplanning/i18n/pt';
import { locale as routeplanningSpanish } from 'app/main/logistic/routeplanning/i18n/sp';
import { RoutePlanningDriverService, RoutePlanningRouteService } from '../services';
import { faBan, faThumbtack, faMapPin, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { DragDropComponent } from '../components/drag-drop/drag-drop.component';
import { DriverlistTableComponent } from '../components/driverlist-table/driverlist-table.component';
import { JoblistTableComponent } from '../components/joblist-table/joblist-table.component';
import { isEmpty } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const google: any;


@Component({
    selector: 'logistic-routeplanning',
    templateUrl: './routeplanning.component.html',
    styleUrls: ['./routeplanning.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutePlanningComponent implements OnInit, OnDestroy {
    activatedTabIndex: number = 0;
    routeList: Array<any>;
    totalJobs: number = 0;
    totalDrivers: number = 0;
    totalRoutes: number = 0;
    defaultDate: Date;
    isDisplayDnD: boolean = false;
    isGenerateRoute: boolean = false;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(DragDropComponent) dndComponent: DragDropComponent;
    @ViewChild(DriverlistTableComponent) driverListComponent: DriverlistTableComponent;
    @ViewChild(JoblistTableComponent) jobListComponent: JoblistTableComponent;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
        private routePlanningRouteService: RoutePlanningRouteService,
        public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routeplanningEnglish, routeplanningSpanish, routeplanningFrench, routeplanningPortuguese);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    folded: true
                }
            }
        };
    }

    ngOnInit(): void {
        this.defaultDate = new Date();
        this.getRouteList();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    openDnDDialog() {

        this.isDisplayDnD = true;
    }

    closeDialog(isConfirm) {
        this.isDisplayDnD = false;
        if (isConfirm) {
            this.dndComponent.deleteFile(0, true, true);
        } else {
            this.dndComponent.deleteFile(0, true, false);
        }
    }

    countTotalJobs(total) {
        this.totalJobs = total;

    }

    countTotalDrivers(total) {
        this.totalDrivers = total;
    }
    countTotalRoutes(total) {
        this.totalRoutes = total;
    }

    getRouteList() {
        this.routePlanningRouteService.getRoutePlanningRoute(1, 100000, 'id', 'asc', this.paramDateFormat(this.defaultDate), 'GetPlanningRoutes').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            if (res.responseCode == 100) {
                this.routeList = JSON.parse(res.TrackingXLAPI.DATA[0].routes);
                // this.routeList = routes;

                if (this.routeList && this.routeList.length > 0) {
                    this.totalRoutes = this.routeList.length;
                    this.isGenerateRoute = true;
                } else {
                    this.totalRoutes = 0;
                    this.isGenerateRoute = false;
                }
            } else {
                this.routeList = [];
                this.totalRoutes = 0;
                this.isGenerateRoute = false;
            }
        });
    }

    isLoadedRoutes(isLoadedRoutes: boolean) {

        this.isGenerateRoute = isLoadedRoutes;
    }

    checkGeneratingRoute(e: any) {
        if (e == 'jobs') {
            this.activatedTabIndex = 0;
        } else if (e == 'drivers') {
            this.activatedTabIndex = 1;
        } else if (e == 'generate') {
            this.getRouteList();
        }
    }

    addNewJob(): void {
        this.router.navigate(['logistic/routeplanning/jobdetail']);
    }

    changeDate(): void {

        this.jobListComponent.getJobList(this.defaultDate);
        this.driverListComponent.getDriverList(this.defaultDate);
        this.getRouteList();
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