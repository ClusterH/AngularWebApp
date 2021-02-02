import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RouteDetailService {
    route: any;
    public route_detail: any;
    public unit_clist_item: any = {};
    public current_routeID: number;

    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    saveRouteDetail(routeDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', routeDetail.id.toString())
            .set('name', routeDetail.name.toString())
            .set('isactive', routeDetail.isactive.toString())
            .set('createdby', routeDetail.createdby.toString())
            .set('created', routeDetail.created.toString())
            .set('lastmodifiedby', routeDetail.lastmodifiedby.toString())
            .set('lastmodifieddate', routeDetail.lastmodifieddate.toString())
            .set('method', 'route_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}