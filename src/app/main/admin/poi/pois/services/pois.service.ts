import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class PoisService {
    poiList: any;
    constructor(private _httpClient: HttpClient) { }

    getPois(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
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

    deletePoi(id: number): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "poi_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}