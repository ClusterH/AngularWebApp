import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CarrierDetailService {
    routeParams: any;
    carrier: any;
    public carrier_detail: any;
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

    saveCarrierDetail(carrierDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', carrierDetail.id.toString())
            .set('name', carrierDetail.name.toString())
            .set('isactive', carrierDetail.isactive.toString())
            .set('created', carrierDetail.created.toString())
            .set('createdby', carrierDetail.createdby.toString())
            .set('deletedwhen', carrierDetail.deletedwhen.toString())
            .set('deletedby', carrierDetail.deletedby.toString())
            .set('lastmodifieddate', carrierDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', carrierDetail.lastmodifiedby.toString())
            .set('method', 'carrier_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}