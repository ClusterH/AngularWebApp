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
}