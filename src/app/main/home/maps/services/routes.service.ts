import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class RoutesService {

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
}