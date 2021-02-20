import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class RoutePlanningDriverService {
    public loadingsubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingsubject.asObservable();
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getRoutePlanningDriver(pageindex: number, pagesize: number, orderby: string, orderdirection: string, seldate: string, method: string): Observable<any> {
        const params = new HttpParams()
            .set('pageindex', (pageindex).toString())
            .set('pagesize', pagesize.toString())
            .set('orderby', orderby.toString())
            .set('orderdirection', orderdirection.toString())
            .set('seldate', seldate.toString())
            .set('method', method.toString());
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    getUserPOIs(): Observable<any> {
        const params = new HttpParams()
            .set('pageindex', '1')
            .set('pagesize', '1000000')
            .set('method', 'GetUserPOIs');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    setDriverStartTimeAndPlace(data): Observable<any> {
        const params = new HttpParams()
            .set('driverids', data.driverids)
            .set('startlocation', data.startlocation)
            .set('seldate', data.seldate)
            .set('starttime', data.starttime)
            .set('endtime', data.endtime)
            .set('latitude', data.latitude)
            .set('longitude', data.longitude)
            .set('method', 'SetDriverStartTimeAndPlace');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    setDriverInclude(id: number, include: number, seldate: string): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('include', include.toString())
            .set('seldate', seldate.toString())
            .set('method', "Operator_SetInclude");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    deleteDriver(id: number, seldate: string): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('seldate', seldate.toString())
            .set('method', "Operator_Delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}