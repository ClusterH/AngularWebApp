import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ZoneRouteModel } from '../models';

@Injectable()
export class RoutesService {
    public routes = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public routes$: Observable<Array<ZoneRouteModel[]>> = this.routes.asObservable();
    public filterRoutes = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public filterRoutes$: Observable<Array<ZoneRouteModel[]>> = this.filterRoutes.asObservable();

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

    updateRoutes(routes: any) {
        this.routes.next(routes);
    }

    updateFilterRoutes(routes: any) {
        this.filterRoutes.next(routes);
    }
}