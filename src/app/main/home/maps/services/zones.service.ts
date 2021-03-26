import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ZoneRouteModel } from '../models';

@Injectable()
export class ZonesService {
    public zones = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public zones$: Observable<Array<ZoneRouteModel[]>> = this.zones.asObservable();
    public filterZones = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public filterZones$: Observable<Array<ZoneRouteModel[]>> = this.filterZones.asObservable();

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }

    getZones(): Observable<any> {
        const params = new HttpParams()
            .set('method', "GetZonesForMap");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    updateZones(zones: any) {
        this.zones.next(zones);
    }

    updateFilterZones(zones: any) {
        this.filterZones.next(zones);
    }
}