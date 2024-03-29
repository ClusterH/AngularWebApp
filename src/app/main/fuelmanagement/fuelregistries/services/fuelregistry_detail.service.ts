import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class FuelregistryDetailService {
    routeParams: any;
    fuelregistry: any;
    public fuelregistry_detail: any;
    public unit_clist_item: any = {};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getDetails(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (method == 'totank_clist' || method == 'fromtank_clist') {
            method = 'fueltank_clist';
        }
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

    saveFuelregistryDetail(fuelregistryDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', fuelregistryDetail.id.toString())
            .set('datentime', fuelregistryDetail.datentime.toString())
            .set('amount', fuelregistryDetail.amount.toString())
            .set('cost', fuelregistryDetail.cost.toString())
            .set('fromtankid', fuelregistryDetail.fromtankid.toString())
            .set('totankid', fuelregistryDetail.totankid.toString())
            .set('tounitid', fuelregistryDetail.tounitid.toString())
            .set('operatorid', fuelregistryDetail.operatorid.toString())
            .set('method', 'fuelregistry_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}