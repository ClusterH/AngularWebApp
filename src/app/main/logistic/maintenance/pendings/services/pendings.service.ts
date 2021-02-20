import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class PendingsService {
    pendings: any[];
    public maintPendingList: any = [];
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getPendings(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        if (filterItem == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    deletePending(id: number): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "pending_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
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