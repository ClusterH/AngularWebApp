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

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        if (name == '') {
            if (method == 'privobject_clist') {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('typeid', this.current_typeID.toString())
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        } else {
            if (method == 'privobject_clist') {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('typeid', this.current_typeID.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        }
    }

    saveDashboardDetail(dashboardDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', dashboardDetail.id.toString())
            .set('isactive', dashboardDetail.isactive.toString())
            .set('name', dashboardDetail.name.toString())
            .set('typeid', dashboardDetail.typeid.toString())
            .set('objectid', dashboardDetail.objectid.toString())
            .set('method', 'dashboard_save');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}