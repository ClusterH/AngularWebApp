import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CommandDetailService {
    routeParams: any;
    command: any;
    public command_detail: any;
    public unit_clist_item: any = {};
    public current_commandID: number;

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

    saveCommandDetail(commandDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', commandDetail.id.toString())
            .set('name', commandDetail.name.toString())
            .set('isactive', commandDetail.isactive.toString())
            .set('createdby', commandDetail.createdby.toString())
            .set('created', commandDetail.createdwhen.toString())
            .set('lastmodifiedby', commandDetail.lastmodifiedby.toString())
            .set('lastmodifieddate', commandDetail.lastmodifieddate.toString())
            .set('method', 'command_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}