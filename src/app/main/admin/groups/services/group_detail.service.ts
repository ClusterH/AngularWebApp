import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GroupDetailService {
    routeParams: any;
    group: any;
    public group_detail: any;
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

    saveGroupDetail(groupDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', groupDetail.id.toString())
            .set('name', groupDetail.name.toString())
            .set('email', groupDetail.email.toString())
            .set('contactname', groupDetail.contactname.toString())
            .set('contactphone', groupDetail.contactphone.toString())
            .set('address', groupDetail.address.toString())
            .set('isactive', groupDetail.isactive.toString())
            .set('companyid', groupDetail.companyid.toString())
            .set('accountid', groupDetail.accountid.toString())
            .set('created', groupDetail.created.toString())
            .set('createdby', groupDetail.createdby.toString())
            .set('deletedwhen', groupDetail.deletedwhen.toString())
            .set('deletedby', groupDetail.deletedby.toString())
            .set('lastmodifieddate', groupDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', groupDetail.lastmodifiedby.toString())
            .set('method', 'group_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}