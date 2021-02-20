import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SysCommandDetailService {
    routeParams: any;
    syscommand: any;
    public syscommand_detail: any;
    public unit_clist_item: any = {};
    public current_syscommandID: number;

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

    saveSysCommandDetail(syscommandDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', syscommandDetail.id.toString())
            .set('name', syscommandDetail.name.toString())
            .set('isactive', syscommandDetail.isactive.toString())
            .set('createdby', syscommandDetail.createdby.toString())
            .set('created', syscommandDetail.createdwhen.toString())
            .set('lastmodifiedby', syscommandDetail.lastmodifiedby.toString())
            .set('lastmodifieddate', syscommandDetail.lastmodifieddate.toString())
            .set('method', 'syscommand_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}