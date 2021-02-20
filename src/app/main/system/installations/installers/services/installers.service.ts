import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class InstallersService {
    installers: any[];
    public unit_clist_item: any = {};
    public installerList: any = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getInstallers(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
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

    getInstallContractor(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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

    getCarrier(pageindex: number, pagesize: number, name: string): Observable<any> {
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', 'carrier_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', 'carrier_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params_detail
            });
        }
    }

    saveInstaller(installerDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', installerDetail.id.toString())
            .set('name', installerDetail.name.toString())
            .set('username', installerDetail.name.toString())
            .set('password', installerDetail.name.toString())
            .set('email', installerDetail.name.toString())
            .set('cellphone', installerDetail.name.toString())
            .set('installcontractorid', installerDetail.installcontractorid.toString())
            .set('carrierid', installerDetail.carrierid.toString())
            .set('isactive', installerDetail.isactive.toString())
            .set('deletedby', installerDetail.deletedby.toString())
            .set('deletedwhen', installerDetail.deletedwhen.toString())
            .set('method', 'installer_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    deleteInstaller(id: string): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "installer_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}