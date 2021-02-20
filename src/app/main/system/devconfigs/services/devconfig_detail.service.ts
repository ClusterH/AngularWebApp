import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DevConfigDetailService {
    routeParams: any;
    devconfig: any;
    devconfig_detail: any;
    public devconfig_id: number;
    public unit_clist_item: any = {};

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

    getDevConfigCmd(pageindex: number, pagesize: number, name: string, filterstring: string, method: string): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('devconfigid', this.devconfig_id.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('devconfigid', this.devconfig_id.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set(`${name}`, `^${filterstring}^`)
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    saveDevConfigDetail(devconfigDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', devconfigDetail.id.toString())
            .set('name', devconfigDetail.name.toString())
            .set('isactive', devconfigDetail.isactive.toString())
            .set('createdby', devconfigDetail.createdby.toString())
            .set('created', devconfigDetail.createdwhen.toString())
            .set('lastmodifiedby', devconfigDetail.lastmodifiedby.toString())
            .set('lastmodifieddate', devconfigDetail.lastmodifieddate.toString())
            .set('method', 'devconfig_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    saveDevConfigCmd(currentDevConfigCmdid: number, commandid: number, syscommandid: number, devconfigid: number): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', currentDevConfigCmdid.toString())
            .set('commandid', commandid.toString())
            .set('syscommandid', syscommandid.toString())
            .set('devconfigid', devconfigid.toString())
            .set('method', 'devconfigcmd_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}