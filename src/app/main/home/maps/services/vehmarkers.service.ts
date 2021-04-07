import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { VehicleModel, POIModel, NewPOIModel } from '../models';

@Injectable()
export class VehMarkersService {
    private vehicleMarkers = new BehaviorSubject<VehicleModel[]>([]);
    public vehicleMarkers$: Observable<VehicleModel[]> = this.vehicleMarkers.asObservable();
    private filterMarkers = new BehaviorSubject<VehicleModel[]>([]);
    public filterMarkers$: Observable<VehicleModel[]> = this.filterMarkers.asObservable();

    private poiMarkers = new BehaviorSubject<POIModel[]>([]);
    public poiMarkers$: Observable<POIModel[]> = this.poiMarkers.asObservable();
    private poiFilterMarkers = new BehaviorSubject<POIModel[]>([]);
    public poiFilterMarkers$: Observable<POIModel[]> = this.poiFilterMarkers.asObservable();

    public newPOILocation = new BehaviorSubject<NewPOIModel>({});
    public newPOILocation$: Observable<NewPOIModel> = this.newPOILocation.asObservable();
    public hasLocation: boolean = false;

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

    updateNewPOILocation(location: any) {
        if (!this.hasLocation) { this.hasLocation = true };
        this.newPOILocation.next({ latitude: location.lat, longitude: location.lng });
    }

    savePoiDetail(poiDetail: NewPOIModel): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', poiDetail.id.toString())
            .set('name', poiDetail.name.toString())
            .set('address', poiDetail.address.toString())
            .set('latitude', poiDetail.latitude.toString())
            .set('longitude', poiDetail.longitude.toString())
            .set('isactive', 'true')
            .set('created', poiDetail.created)
            .set('createdby', poiDetail.createdby)
            .set('method', 'poi_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}