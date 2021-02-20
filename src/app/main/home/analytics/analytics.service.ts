import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    widgets: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */

    dashboardClist(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method);
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method);
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getDashboardClips(): Observable<any> {
        const params = new HttpParams()
            .set('method', 'GetDashboardClips');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    dashboardSave(dashboard): Observable<any> {
        const params = new HttpParams()
            .set('id', dashboard.id.toString())
            .set('name', dashboard.name.toString())
            .set('isactive', dashboard.isactive.toString())
            .set('timeselection', dashboard.timeselection.toString())
            .set('groupselection', dashboard.groupselection.toString())
            .set('method', 'dashboard_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    dashboardDelete(dashboardid): Observable<any> {
        const params = new HttpParams()
            .set('id', dashboardid.toString())
            .set('method', 'dashboard_delete');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    dashboard_clip_save(widgets: any = []): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": widgets,
            "method": "dashboard_clip_save",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }
}