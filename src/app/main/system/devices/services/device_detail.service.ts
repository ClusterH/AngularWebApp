import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceDetailService {
    routeParams: any;
    device: any;
    public device_detail: any;
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
        if (method == "connin_clist" || method == "connout_clist" || method == "connsms_clist") {
            method = "connection_clist";
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

    saveDeviceDetail(deviceDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', deviceDetail.id.toString())
            .set('name', deviceDetail.name.toString())
            .set('simcardid', deviceDetail.simcardid.toString())
            .set('devicetypeid', deviceDetail.devicetypeid.toString())
            .set('conninid', deviceDetail.conninid.toString())
            .set('connoutid', deviceDetail.connoutid.toString())
            .set('connsmsid', deviceDetail.connsmsid.toString())
            .set('imei', deviceDetail.imei.toString())
            .set('serialnumber', deviceDetail.serialnumber.toString())
            .set('activationcode', deviceDetail.activationcode.toString())
            .set('created', deviceDetail.created.toString())
            .set('createdby', deviceDetail.createdby.toString())
            .set('deletedwhen', deviceDetail.deletedwhen.toString())
            .set('deletedby', deviceDetail.deletedby.toString())
            .set('lastmodifieddate', deviceDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', deviceDetail.lastmodifiedby.toString())
            .set('isactive', deviceDetail.isactive.toString())
            .set('method', 'device_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}