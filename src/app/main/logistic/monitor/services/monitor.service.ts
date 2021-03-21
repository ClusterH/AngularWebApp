import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Trip, PointModel } from '../model';

@Injectable()
export class MonitorService {
    public loadingsubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingsubject.asObservable();
    public unit_clist_item: any = {};
    public monitor = new BehaviorSubject<any>([]);
    monitor$: Observable<any[]> = this.monitor.asObservable();


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getMonitor(pageindex: number, pagesize: number, orderby: string, orderdirection: string, statusids: string, method: string): Observable<any> {
        const params = new HttpParams()
            .set('pageindex', (pageindex).toString())
            .set('pagesize', pagesize.toString())
            .set('orderby', orderby.toString())
            .set('orderdirection', orderdirection.toString())
            .set('tripstatusids', statusids.toString())
            .set('method', method.toString());
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    getClists(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    saveNewTrip(trip: Trip): Observable<any> {
        let params = new HttpParams()
            .set('method', 'tripwatch_save')
            .set('tripstatusid', '1');
        for (let key in trip) {
            params = params.append(key, trip[key]);
        }

        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    setTripPath(tripArray: PointModel[]): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "array": tripArray,
            "method": "Set_Trip_Path",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }

    getTripWatchPath(tripid: number): Observable<any> {
        let params = new HttpParams()
            .set('method', 'GetTripWatchPath')
            .set('id', tripid.toString());
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    tripEvent(method: string, tripid: number): Observable<any> {
        let params = new HttpParams()
            .set('method', method)
            .set('tripid', tripid.toString());
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}