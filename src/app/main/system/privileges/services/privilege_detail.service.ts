import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PrivilegeDetailService {
    routeParams: any;
    privilege: any;
    public privilege_detail: any;
    public unit_clist_item: any = {};
    public current_typeID: number;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            if (method == 'privobject_clist') {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('typeid', this.current_typeID.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            } else {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            }
        } else {
            if (method == 'privobject_clist') {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('typeid', this.current_typeID.toString())
                    .set('name', `^${name}^`)
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
    }

    savePrivilegeDetail(privilegeDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', privilegeDetail.id.toString())
            .set('isactive', privilegeDetail.isactive.toString())
            .set('name', privilegeDetail.name.toString())
            .set('typeid', privilegeDetail.typeid.toString())
            .set('objectid', privilegeDetail.objectid.toString())
            .set('method', 'privilege_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}