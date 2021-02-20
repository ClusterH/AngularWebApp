import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ContractorsService {
    contractors: any[];
    public unit_clist_item: any = {};
    public contractorList: any = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getContractors(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        if (filterItem == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getCarriers(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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

    saveContractor(contractorDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', contractorDetail.id.toString())
            .set('name', contractorDetail.name.toString())
            .set('username', contractorDetail.username.toString())
            .set('password', contractorDetail.password.toString())
            .set('contactname', contractorDetail.contactname.toString())
            .set('contactphonenumber', contractorDetail.contactphonenumber.toString())
            .set('isactive', contractorDetail.isactive.toString())
            .set('deletedby', contractorDetail.deletedby.toString())
            .set('deletedwhen', contractorDetail.deletedwhen.toString())
            .set('notificationemail', contractorDetail.notificationemail.toString())
            .set('notificationcellphone', contractorDetail.notificationcellphone.toString())
            .set('carrierid', contractorDetail.carrierid.toString())
            .set('method', 'Installcontractor_Save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    deleteContractor(id: string): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "Installcontractor_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}