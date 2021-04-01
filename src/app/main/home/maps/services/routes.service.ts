import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ZoneRouteModel } from '../models';
// declare const google: any;

@Injectable()
export class RoutesService {
    private routes = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public routes$: Observable<Array<ZoneRouteModel[]>> = this.routes.asObservable();
    private filterRoutes = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public filterRoutes$: Observable<Array<ZoneRouteModel[]>> = this.filterRoutes.asObservable();

    public polyZone = [];
    public geoFencePointsList = [];

    // public measureDistancePoints: Array<any> = [];
    totalDistance: number = 0;
    totalArea: number = 0;
    measureArea = [];

    lastPoint: any;
    showDialog: boolean = false;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }

    getRoutes(): Observable<any> {
        const params = new HttpParams()
            .set('method', "GetRoutesForMap");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    saveRouteName(name: string): Observable<any> {
        const params = new HttpParams()
            .set('id', '0')
            .set('name', name)
            .set('isactive', 'true')
            .set('method', "route_save");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    setRoutePath(pathArray: any = []): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "array": pathArray,
            "method": "Set_Route_Path",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }

    updateRoutes(routes: any): void {
        this.routes.next(routes);
    }

    updateFilterRoutes(routes: any): void {
        this.filterRoutes.next(routes);
    }

    updateMeasureDistancePointsList(latLng: any, map: any): void {
        this.showDialog = true;
        this.polyZone = [...this.polyZone, ...[latLng]];
        this.lastPoint = latLng;
        this.measureArea.push(new google.maps.LatLng(latLng.lat, latLng.lng));
        this.checkIsShowPanel();
    }

    checkIsShowPanel(): void {
        if (this.measureArea.length > 0) {
            this.showDialog = true;
            this.measureCalc();
        }
    }

    measureCalc(): void {
        this.totalDistance = google.maps.geometry.spherical.computeLength(this.measureArea) / 1000;
        if (this.measureArea.length > 2) {
            // Use the Google Maps geometry library to measure the area of the polygon
            this.totalArea = google.maps.geometry.spherical.computeArea(this.measureArea) / 1000000;
        } else {
            this.totalArea = 0;
        }
    }

    resetMeasurement(): void {
        this.totalDistance = 0;
        this.totalArea = 0;
        this.measureArea = [...[]];
        this.lastPoint = {};
        this.polyZone = [...[]];
    }

    //create Geofence
    updateGeofencePointsList(point: any): void {
        console.log('updatePoints ===>>>', point);
        this.geoFencePointsList = [...this.geoFencePointsList, ...[point]];
    }
}