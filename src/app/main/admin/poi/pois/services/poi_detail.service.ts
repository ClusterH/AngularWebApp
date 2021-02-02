import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PoiDetailService {
    poi: any;
    public poi_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

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

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    savePoiDetail(poiDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', poiDetail.id.toString())
            .set('name', poiDetail.name.toString())
            .set('companyid', poiDetail.companyid.toString())
            .set('groupid', poiDetail.groupid.toString())
            .set('subgroup', poiDetail.subgroup.toString())
            .set('radius', poiDetail.radius.toString())
            .set('pointid', poiDetail.pointid.toString())
            .set('pointtypeid', poiDetail.pointtypeid.toString())
            .set('address', poiDetail.address.toString())
            .set('latitude', poiDetail.latitude.toString())
            .set('longitude', poiDetail.longitude.toString())
            .set('isactive', poiDetail.isactive.toString())
            .set('created', poiDetail.created.toString())
            .set('createdby', poiDetail.createdby.toString())
            .set('deletedwhen', poiDetail.deletedwhen.toString())
            .set('deletedby', poiDetail.deletedby.toString())
            .set('lastmodifieddate', poiDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', poiDetail.lastmodifiedby.toString())
            .set('method', 'poi_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}