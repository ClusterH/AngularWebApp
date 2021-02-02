import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ZoneDetailService {
    routeParams: any;
    zone: any;
    public zone_detail: any;
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

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        if (name == '') {
            let params = new HttpParams()

                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
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

    saveZoneDetail(zoneDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()

            .set('id', zoneDetail.id.toString())
            .set('name', zoneDetail.name.toString())
            .set('companyid', zoneDetail.companyid.toString())
            .set('isactive', zoneDetail.isactive.toString())
            .set('created', zoneDetail.created.toString())
            .set('createdby', zoneDetail.createdby.toString())
            .set('deletedwhen', zoneDetail.deletedwhen.toString())
            .set('deletedby', zoneDetail.deletedby.toString())
            .set('lastmodifieddate', zoneDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', zoneDetail.lastmodifiedby.toString())
            .set('method', 'zone_save');



        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
