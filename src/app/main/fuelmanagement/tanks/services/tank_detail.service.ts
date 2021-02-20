import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TankDetailService {
    routeParams: any;
    tank: any;
    public tank_detail: any;
    public unit_clist_item: any = {};
    public current_tankID: number;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params_detail
            });
        }
    }

    saveTankDetail(tankDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', tankDetail.id.toString())
            .set('name', tankDetail.name.toString())
            .set('isactive', tankDetail.isactive.toString())
            .set('companyid', tankDetail.companyid.toString())
            .set('groupid', tankDetail.groupid.toString())
            .set('lastreport', tankDetail.lastreport)
            .set('volume', tankDetail.volume.toString())
            .set('volumeunitid', tankDetail.volumeunitid.toString())
            .set('level', tankDetail.level.toString())
            .set('levelunitid', tankDetail.levelunitid.toString())
            .set('temp', tankDetail.temp.toString())
            .set('tempunitid', tankDetail.tempunitid.toString())
            .set('hassensor', tankDetail.hassensor.toString())
            .set('capacity', tankDetail.capacity.toString())
            .set('method', 'FuelTank_Save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    getTankHistory(tankid: number, fromtime: string, totime: string): Observable<any> {
        const params_detail = new HttpParams()
            .set('tankid', tankid.toString())
            .set('fromtime', fromtime.toString())
            .set('totime', totime.toString())
            .set('method', 'fueltank_history');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}