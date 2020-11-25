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
import { isEmpty } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
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

    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    restrictValue: any;
    displayedColumns = ['unit', 'driver', 'route', 'start', 'fromto', 'progress', 'delay'];
    displayedColumnsDetail = ['stop_client', 'time', 'arrived', 'eta', 'leave', 'duration', 'delay_detail'];

    map: any;
    lat: number;
    lng: number;
    zoom: number = 12;

    unit_icon_start_green = {
        url: 'assets/icons/googlemap/play-green.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_start_red = {
        url: 'assets/icons/googlemap/play-red.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_end_green = {
        url: 'assets/icons/googlemap/stop-green.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_end_red = {
        url: 'assets/icons/googlemap/stop-red.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_arrived = {
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_unarrived = {
        url: 'assets/icons/googlemap/red-marker.png',
        scaledSize: { width: 10, height: 10 },
    }

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

        this.routecenterService.loadingsubject.next(false);
        this.routecenterService.getRouteCenter(1, 10, 'id', 'asc', '', '', 'GetCurrentRuns').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource = JSON.parse(res.TrackingXLAPI.DATA[0].routes);
            this.dataSource = this.dataSource.map((item, index) => {
                item.colorIndex = index;
                return item;
            });
            console.log(this.dataSource);
            if (this.dataSource) {
                this.totalRecords = this.dataSource.length;
                setTimeout(() => {
                    this.routecenterService.loadingsubject.next(true);
                    this.primengConfig.ripple = true;
                }, 0);
            }
        });
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onMapReady(map: any) {
        this.map = map;
    }
    onDateSelect(value) {
        console.log(value, this.formatDate(value))
        this.table.filter(this.formatDate(value), 'start', 'contains')
    }

    formatDate(date) {
        // let month = date.getMonth() + 1;
        // let day = date.getDate();

        // if (month < 10) {
        //     month = '0' + month;
        // }

        // if (day > 10) {
        //     day = '0' + day;
        // }

        return date.toString().slice(4, 15);
    }

    isCheckRoute() {
        if (isEmpty(this.selectedRouteCenter)) {
            this.isRoute = false;

            this.lat = 25.7959;
            this.lng = -80.2871;
            this.zoom = 12;

            this.boundControl(this.zoom, this.lat, this.lng);

            return;
        } else {
            this.isRoute = true;
            this.selectedRouteCenter = this.selectedRouteCenter.map(route => {
                if (route.strokeColor) {
                    return route;
                };

                route.stop_start = route.stops.slice(0, 1);
                route.stop_end = route.stops.slice(-1);
                route.stop_routes = route.stops.slice(1, -1);

                const color_key = Object.keys(this.color)[route.colorIndex];
                route.strokeColor = this.color[color_key];

                return route;
            });
        }
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
}