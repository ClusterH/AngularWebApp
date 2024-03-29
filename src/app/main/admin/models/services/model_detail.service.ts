import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ModelDetailService {
    routeParams: any;
    model: any;
    public model_detail: any;
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

    saveModelDetail(modelDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', modelDetail.id.toString())
            .set('name', modelDetail.name.toString())
            .set('makeid', modelDetail.makeid.toString())
            .set('isactive', modelDetail.isactive.toString())
            .set('createdwhen', modelDetail.createdwhen.toString())
            .set('createdby', modelDetail.createdby.toString())
            .set('lastmodifieddate', modelDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', modelDetail.lastmodifiedby.toString())
            .set('tireconfigurationid', modelDetail.tireconfigurationid.toString())
            .set('method', 'model_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}