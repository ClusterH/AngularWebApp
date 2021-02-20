import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class UnitInfoService {
    // onUnitChanged: any = '';
    TrackHistoryList: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        this.TrackHistoryList = new BehaviorSubject({});
    }

    getUnitInfo(unitid: number): Observable<any> {
        const params = new HttpParams()
            .set('id', unitid.toString())
            .set('method', 'GetUnitInfo_v1');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    getPOIInfo(poiid: number): Observable<any> {
        const params = new HttpParams()
            .set('id', poiid.toString())
            .set('method', 'GetPOIInfo');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    getPOIInfo_v1(poiid: number): Observable<any> {
        const params = new HttpParams()
            .set('id', poiid.toString())
            .set('method', 'GetPOIInfo_V1');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    sendShareLocation(unitid: number, validitytime: number, emailaddress: string): Observable<any> {
        const params = new HttpParams()
            .set('unitid', unitid.toString())
            .set('validitytime', validitytime.toString())
            .set('emailaddress', emailaddress.toString())
            .set('method', 'ShareLocation');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    locateNow(unitid: number): Observable<any> {
        const params = new HttpParams()
            .set('unitid', unitid.toString())
            .set('method', 'LocateUnit');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    getPOIList(unitid: number, pageindex: number, pagesize: number, filterstring: string): Observable<any> {
        const params = new HttpParams()
            .set('unitid', unitid.toString())
            .set('pageindex', pageindex.toString())
            .set('pagesize', pagesize.toString())
            .set('method', 'GetUnitPOIs');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    playbackHistory(param: any, method: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (param.historytype == '4') {
                const params = new HttpParams()
                    .set('unitid', param.unitid.toString())
                    .set('historytype', param.historytype.toString())
                    .set('datefrom', param.datefrom.toString())
                    .set('dateto', param.dateto.toString())
                    .set('method', method);
                this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                }).subscribe(res => {
                    resolve(res);
                }, reject)
            } else {
                const params = new HttpParams()
                    .set('unitid', param.unitid.toString())
                    .set('historytype', param.historytype.toString())
                    .set('method', method);
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                }).subscribe(res => {
                    resolve(res);
                }, reject)
            }
        })
    }
}