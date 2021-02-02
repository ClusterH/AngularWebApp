import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AccountDetailService {
    routeParams: any;
    account: any;
    public account_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

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
            if (method == 'model_clist') {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('makeid', this.current_makeID.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        } else {
            if (method == 'model_clist') {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('makeid', this.current_makeID.toString())
                    .set('name', `^${name}^`)
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
    }

    saveAccountDetail(accountDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', accountDetail.id.toString())
            .set('name', accountDetail.name.toString())
            .set('email', accountDetail.email.toString())
            .set('address', accountDetail.address.toString())
            .set('phonenumber', accountDetail.phonenumber.toString())
            .set('contactname', accountDetail.contactname.toString())
            .set('billingstatusid', accountDetail.billingstatusid.toString())
            .set('billingfrequency', accountDetail.billingfrequency.toString())
            .set('isactive', accountDetail.isactive.toString())
            .set('created', accountDetail.created.toString())
            .set('createdby', accountDetail.createdby.toString())
            .set('deletedwhen', accountDetail.deletedwhen.toString())
            .set('deletedby', accountDetail.deletedby.toString())
            .set('lastmodifieddate', accountDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', accountDetail.lastmodifiedby.toString())
            .set('method', 'account_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}