import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ZonesService {
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
}