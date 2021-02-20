import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardDetailService {
    routeParams: any;
    dashboard: any;
    public dashboard_detail: any;
    public unit_clist_item: any = {};
    public current_typeID: number;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    saveDashboardDetail(dashboardDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', dashboardDetail.id.toString())
            .set('name', dashboardDetail.name.toString())
            .set('userid', dashboardDetail.userid.toString())
            .set('isactive', dashboardDetail.isactive.toString())
            .set('timeselection', dashboardDetail.timeselection.toString())
            .set('groupselection', dashboardDetail.groupselection.toString())
            .set('method', 'dashboard_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    getClip_List(dashboardid, method): Observable<any> {
        const params_detail = new HttpParams()
            .set('dashboardid', dashboardid.toString())
            .set('method', method);
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}