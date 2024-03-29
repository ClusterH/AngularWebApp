import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionDetailService {
    routeParams: any;
    connection: any;
    public connection_detail: any;
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

    saveConnectionDetail(connectionDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', connectionDetail.id.toString())
            .set('name', connectionDetail.name.toString())
            .set('conntype', connectionDetail.conntype.toString())
            .set('localport', connectionDetail.localport.toString())
            .set('protocolid', connectionDetail.protocolid.toString())
            .set('isactive', connectionDetail.isactive.toString())
            .set('created', connectionDetail.created.toString())
            .set('createdby', connectionDetail.createdby.toString())
            .set('deletedwhen', connectionDetail.deletedwhen.toString())
            .set('deletedby', connectionDetail.deletedby.toString())
            .set('lastmodifieddate', connectionDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', connectionDetail.lastmodifiedby.toString())
            .set('method', 'connection_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}