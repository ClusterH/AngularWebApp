import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AgmMap, AgmMarker, LatLngBounds, MapsAPILoader, MouseEvent } from '@agm/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routecenterEnglish } from 'app/main/logistic/routecenter/i18n/en';
import { locale as routecenterFrench } from 'app/main/logistic/routecenter/i18n/fr';
import { locale as routecenterPortuguese } from 'app/main/logistic/routecenter/i18n/pt';
import { locale as routecenterSpanish } from 'app/main/logistic/routecenter/i18n/sp';
import { RouteCenterService } from 'app/main/logistic/routecenter/services/routecenter.service';
import { faBan, faThumbtack, faMapPin, faStopCircle } from '@fortawesome/free-solid-svg-icons';

import { isEmpty } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const google: any;

@Component({
    selector: 'logistic-routecenter',
    templateUrl: './routecenter.component.html',
    styleUrls: ['./routecenter.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteCenterComponent implements OnInit, OnDestroy {
    dataSource: any[];
    routecenter: any[];
    selectedRouteCenter: any[];
    totalRecords: number;
    loading: boolean = false;
    dataSourceDetail = [];
    defaultDate: Date;
    selected = '';
    filter_string: string = '';
    currentUser: any;
    restrictValue: any;
    displayedColumns = ['unit', 'driver', 'route', 'start', 'fromto', 'progress', 'delay'];
    displayedColumnsDetail = ['stop_client', 'time', 'arrived', 'eta', 'leave', 'duration', 'delay_detail'];

    map: any;
    lat: number;
    lng: number;
    zoom: number = 12;

    unit_icon_start_green = `{
        url: 'assets/icons/googlemap/play-green.svg',
        scaledSize: { width: 10, height: 10 },
    }`;
    unit_icon_start_red = `{
        url: 'assets/icons/googlemap/play-red.svg',
        scaledSize: { width: 10, height: 10 },
    }`;
    unit_icon_end_green = `{
        url: 'assets/icons/googlemap/stop-green.svg',
        scaledSize: { width: 10, height: 10 },
    }`;
    unit_icon_end_red = `{
        url: 'assets/icons/googlemap/stop-red.svg',
        scaledSize: { width: 10, height: 10 },
    }`;
    unit_icon_arrived = `{
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 10, height: 10 },
    }`;
    unit_icon_unarrived = `{
        url: 'assets/icons/googlemap/red-marker.png',
        scaledSize: { width: 10, height: 10 },
    }`;
    unit_icon_unauth = `{
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 100, height: 100 },
    }`;

    faBan = faBan;
    faThumbtack = faThumbtack;
    faMapPin = faMapPin;
    faStopCircle = faStopCircle;

    color: any = {
        blue: "#0000ff",
        red: "#ff0000",
        indigo: "#4b0082",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgreen: "#006400",
        darkmagenta: "#8b008b",
        darkred: "#8b0000",
        darkviolet: "#9400d3",
        fuchsia: "#ff00ff",
        green: "#008000",
        lime: "#00ff00",
        magenta: "#ff00ff",
        yellow: "#ffff00"
    }

    resizedWidthPercent: number = 50;
    isDrag: boolean = false;
    isRoute: boolean = false;
    isVehicleTrack: boolean = false;
    isUnAuthorized: boolean = false;
    isOffRoute: boolean = false;
    unPlannedStopsList: Array<any> = [];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private _unsubscribeAll: Subject<any>;

    @ViewChild('dt') table: Table;
    @ViewChild('AgmMap') agmMap: AgmMap;

    constructor(
        public routecenterService: RouteCenterService,
        public _matDialog: MatDialog,
        private primengConfig: PrimeNGConfig,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routecenterEnglish, routecenterSpanish, routecenterFrench, routecenterPortuguese);

        this.selected = '';
        this.filter_string = '';

        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    folded: true
                }
            }
        };

        this.lat = 25.7959;
        this.lng = -80.2871;
    }

    ngOnInit(): void {
        this.defaultDate = new Date('2020-11-18');

        this.getRoute();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    applyFilterGlobal($event, stringVal) {
        this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getRoute(date?: string) {
        this.routecenterService.loadingsubject.next(false);
        this.routecenterService.getRouteCenter(1, 10, 'id', 'asc', '', '', 'GetCurrentRuns').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource = JSON.parse(res.TrackingXLAPI.DATA[0].routes);
            this.dataSource = this.dataSource.map((route, index) => {
                route.colorIndex = index;
                route.stop_start = route.stops.slice(0, 1);
                route.stop_end = route.stops.slice(-1);
                route.stop_routes = route.stops.slice(1, -1);

                const color_key = Object.keys(this.color)[route.colorIndex];
                route.strokeColor = this.color[color_key];

                this.getUnPlannedStops(route.id, route.strokeColor, this.formatDate(this.defaultDate)).then(res => {
                    route.unPlannedStops = res;
                });
                return route;
            });


            if (this.dataSource) {
                this.totalRecords = this.dataSource.length;
                setTimeout(() => {
                    this.routecenterService.loadingsubject.next(true);
                    this.primengConfig.ripple = true;
                }, 0);
            }
        });
    }

    getUnPlannedStops(unitid: number, color: string, date?: string): Promise<any> {

        return new Promise((resolve) => {
            const vehTrack = this.routecenterService.getUnPlannedStops(unitid, date, 'GetUnitHistory');
            const unAuth = this.routecenterService.getUnPlannedStops(unitid, date, 'GetUnauthorizedStops');
            const offRoute = this.routecenterService.getUnPlannedStops(unitid, date, 'GetOffRouteStops');

            forkJoin([vehTrack, unAuth, offRoute]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([vehTrack, unAuth, offRoute]) => {
                const unPlannedStops = {
                    vehTrack: (vehTrack.responseCode == 100) ? vehTrack.TrackingXLAPI.DATA : [],
                    unAuth: (unAuth.responseCode == 100) ? unAuth.TrackingXLAPI.DATA : [],
                    offRoute: (offRoute.responseCode == 100) ? offRoute.TrackingXLAPI.DATA : []
                }

                resolve(unPlannedStops);
            });
        });
    }

    isCheckRoute() {
        if (isEmpty(this.selectedRouteCenter)) {
            this.isRoute = false;
            this.isOffRoute = false;
            this.isVehicleTrack = false;
            this.isUnAuthorized = false;

            this.lat = 25.7959;
            this.lng = -80.2871;
            this.zoom = 12;

            this.boundControl(this.zoom, this.lat, this.lng);

            return;
        } else {
            this.isRoute = true;
        }
    }


    onMapReady(map: any) {
        this.map = map;
    }

    onDateSelect(value) {

        this.isRoute = false;
        this.getRoute();
    }

    formatDate(date) {
        return date.toString().slice(4, 15);
    }


    random_rgba() {
        let result;
        let count = 0;
        for (let prop in this.color) {
            if (Math.random() < 1 / ++count) result = prop;
        }

        return this.color[result];
    }
    dynamicColor(color: string) {
        return color;
    }

    centerMapToStop(e) {
        this.lat = e.latitude + (0.0000000000100 * Math.random());
        this.lng = e.longitude + (0.0000000000100 * Math.random());
        this.zoom = 16;
        this.boundControl(this.zoom, this.lat, this.lng);
    }

    boundControl(zoom: number, lat: number, lng: number) {
        const bounds: LatLngBounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(lat, lng));

        this.map.fitBounds(bounds);

        let zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function (event) {
            if (this.getZoom()) {
                this.setZoom(zoom);
            }
        });
        setTimeout(() => { google.maps.event.removeListener(zoomChangeBoundsListener) }, 2000);
    }

    trackByFn(index, item) {
        return index;
    }
}