import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceplanDetailService {
    routeParams: any;
    serviceplan: any;
    public serviceplan_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) { }

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

    saveServiceplanDetail(serviceplanDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', serviceplanDetail.id.toString())
            .set('name', serviceplanDetail.name.toString())
            .set('carrierplanid', serviceplanDetail.carrierplanid.toString())
            .set('eventtypes', serviceplanDetail.eventtypes.toString())
            .set('daysinhistory', serviceplanDetail.daysinhistory.toString())
            .set('includeignition', serviceplanDetail.includeignition.toString())
            .set('locatecommand', serviceplanDetail.locatecommand.toString())
            .set('hastrips', serviceplanDetail.hastrips.toString())
            .set('hasdistance', serviceplanDetail.hasdistance.toString())
            .set('distance', serviceplanDetail.distance.toString())
            .set('isactive', serviceplanDetail.isactive.toString())
            .set('created', serviceplanDetail.created.toString())
            .set('createdby', serviceplanDetail.createdby.toString())
            .set('deletedwhen', serviceplanDetail.deletedwhen.toString())
            .set('deletedby', serviceplanDetail.deletedby.toString())
            .set('lastmodifieddate', serviceplanDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', serviceplanDetail.lastmodifiedby.toString())
            .set('method', 'serviceplan_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}