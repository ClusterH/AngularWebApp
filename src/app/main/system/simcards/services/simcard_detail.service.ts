import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SimcardDetailService {
    routeParams: any;
    simcard: any;
    public simcard_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
    }

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

    saveSimcardDetail(simcardDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', simcardDetail.id.toString())
            .set('name', simcardDetail.name.toString())
            .set('phonenumber', simcardDetail.phonenumber.toString())
            .set('carrierid', simcardDetail.carrierid.toString())
            .set('isactive', simcardDetail.isactive.toString())
            .set('created', simcardDetail.created.toString())
            .set('createdby', simcardDetail.createdby.toString())
            .set('deletedwhen', simcardDetail.deletedwhen.toString())
            .set('deletedby', simcardDetail.deletedby.toString())
            .set('lastmodifieddate', simcardDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', simcardDetail.lastmodifiedby.toString())
            .set('method', 'simcard_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}