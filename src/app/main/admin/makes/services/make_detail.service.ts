import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MakeDetailService {
    routeParams: any;
    make: any;
    public make_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

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

    saveMakeDetail(makeDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', makeDetail.id.toString())
            .set('name', makeDetail.name.toString())
            .set('isactive', makeDetail.isactive.toString())
            .set('createdby', makeDetail.createdby.toString())
            .set('created', makeDetail.createdwhen.toString())
            .set('lastmodifiedby', makeDetail.lastmodifiedby.toString())
            .set('lastmodifieddate', makeDetail.lastmodifieddate.toString())
            .set('method', 'make_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}