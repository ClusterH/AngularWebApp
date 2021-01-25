import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AgmMap, AgmMarker, LatLngBounds, MapsAPILoader, MouseEvent } from '@agm/core';
import { isEmpty } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faBan, faThumbtack, faMapPin, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { RoutePlanningRouteService, RoutePlanningStorageService } from '../../services';

declare const google: any;

@Component({
    selector: 'app-routelist-map',
    templateUrl: './routelist-map.component.html',
    styleUrls: ['./routelist-map.component.scss']
})
export class RoutelistMapComponent implements OnInit, OnDestroy {
    map: any;
    lat: number;
    lng: number;
    zoom: number = 12;
    isRoute: boolean = false;
    selectedRouteList: Array<any>;

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

    unit_icon_unauth = {
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 100, height: 100 },
    }

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
    private _unsubscribeAll: Subject<any>;

    @ViewChild('AgmMap') AgmMap: AgmMap;

    constructor(
        public routePlanningRouteService: RoutePlanningRouteService,
        private routePlanningStorageService: RoutePlanningStorageService,
    ) {
        this._unsubscribeAll = new Subject();
        this.lat = 25.7959;
        this.lng = -80.2871;
    }

    ngOnInit(): void {
        this.routePlanningStorageService.loading$.subscribe(res => {

            this.selectedRouteList = res;
            if (!isEmpty(this.selectedRouteList)) {
                this.selectedRouteList = this.selectedRouteList.map((route, index) => {
                    route.colorIndex = index;
                    route.stop_start = route.stops.slice(0, 1);
                    route.stop_end = route.stops.slice(-1);
                    route.stop_routes = route.stops.slice(1, -1);

                    const color_key = Object.keys(this.color)[route.colorIndex];
                    route.strokeColor = this.color[color_key];
                    return route;
                });
                this.isRoute = true;

                this.routePlanningStorageService.loadingStop$.subscribe(res => {
                    if (res) {
                        this.centerMapToStop(res);
                    }
                })
            } else {
                this.isRoute = false;
                this.lat = 25.7959;
                this.lng = -80.2871;
                this.zoom = 12;
                if (this.selectedRouteList !== null) {
                    this.boundControl(this.zoom, this.lat, this.lng);
                }
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onMapReady(map: any) {
        this.map = map;
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
