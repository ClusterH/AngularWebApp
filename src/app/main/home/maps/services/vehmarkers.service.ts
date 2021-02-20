import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class VehMarkersService {
    onVehMarkerClickChanged: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
    ) {
        this.onVehMarkerClickChanged = new BehaviorSubject([]);
    }

    getVehMarkers(method: string): Observable<any> {
        const params = new HttpParams()
            .set('method', method);
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}