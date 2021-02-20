import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class RouteCenterService {
    routecenter: any[];
    public loadingsubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingsubject.asObservable();

    public maintPendingList: any = [];
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getRouteCenter(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterString: string, scheduledate: string, method: string): Observable<any> {
        if (filterString == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('scheddate', scheduledate.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('search', `^${filterString}^`.toString())
                .set('scheddate', scheduledate.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getUnPlannedStops(unitid: number, date_time: string, method: string): Observable<any> {
        if (method == 'GetUnitHistory') {
            const params = new HttpParams()
                .set('unitid', unitid.toString())
                .set('historytype', '3')
                .set('method', method);
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('unitid', unitid.toString())
                .set('date_time', date_time.toString())
                .set('method', method);
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getDashboard(): Observable<any> {
        const params = new HttpParams()
            .set('method', "maintenance_dashboard");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    saveAttend(attend: any): Observable<any> {
        const params = new HttpParams()
            .set('id', attend.id.toString())
            .set('action', attend.action.toString())
            .set('cost', attend.cost.toString())
            .set('performdate', attend.performdate.toString())
            .set('method', "maintevent_attend");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}