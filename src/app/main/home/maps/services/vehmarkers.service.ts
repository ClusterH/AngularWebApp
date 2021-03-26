import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { VehicleModel, POIModel } from '../models';

@Injectable()
export class VehMarkersService {
    public vehicleMarkers = new BehaviorSubject<VehicleModel[]>([]);
    public vehicleMarkers$: Observable<VehicleModel[]> = this.vehicleMarkers.asObservable();
    public filterMarkers = new BehaviorSubject<VehicleModel[]>([]);
    public filterMarkers$: Observable<VehicleModel[]> = this.filterMarkers.asObservable();

    public poiMarkers = new BehaviorSubject<POIModel[]>([]);
    public poiMarkers$: Observable<POIModel[]> = this.poiMarkers.asObservable();
    public poiFilterMarkers = new BehaviorSubject<POIModel[]>([]);
    public poiFilterMarkers$: Observable<POIModel[]> = this.poiFilterMarkers.asObservable();

    constructor(
        private _httpClient: HttpClient,
    ) {
    }

    getVehMarkers(method: string): Observable<any> {
        const params = new HttpParams()
            .set('method', method);
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    updateVehicleMarkers(markers: any) {

        this.vehicleMarkers.next(markers);
    }

    updateFilterMarkers(markers: any) {

        this.filterMarkers.next(markers);
    }

    updatePoiMarkers(markers: any) {

        this.poiMarkers.next(markers);
    }

    updatePoiFilterMarkers(markers: any) {

        this.poiFilterMarkers.next(markers);
    }
}