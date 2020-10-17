import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ServiceitemsService {
    serviceitems: any[];
    public unit_clist_item: any = {};
    public serviceitemList: any = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getServiceitems(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (filterItem == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
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

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
    }

    saveServiceitem(serviceitemDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', serviceitemDetail.id.toString())
            .set('name', serviceitemDetail.name.toString())
            .set('companyid', serviceitemDetail.companyid.toString())
            .set('groupid', serviceitemDetail.groupid.toString())
            .set('isactive', serviceitemDetail.isactive.toString())
            .set('method', 'maintserviceitem_save');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    deleteServiceitem(id: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', "maintserviceitem_delete");
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}