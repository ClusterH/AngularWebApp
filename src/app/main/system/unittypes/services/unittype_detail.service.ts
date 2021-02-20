import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UnittypeDetailService {
    routeParams: any;
    unittype: any;
    public unittype_detail: any;
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

    saveUnittypeDetail(unittypeDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', unittypeDetail.id.toString())
            .set('name', unittypeDetail.name.toString())
            .set('producttypeid', unittypeDetail.producttypeid.toString())
            .set('isactive', unittypeDetail.isactive.toString())
            .set('created', unittypeDetail.created.toString())
            .set('createdby', unittypeDetail.createdby.toString())
            .set('deletedwhen', unittypeDetail.deletedwhen.toString())
            .set('deletedby', unittypeDetail.deletedby.toString())
            .set('lastmodifieddate', unittypeDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', unittypeDetail.lastmodifiedby.toString())
            .set('method', 'unittype_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}