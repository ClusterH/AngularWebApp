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
        return new Promise((resolve, reject) => {

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
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method);
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method);
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    getDashboardClips(): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('method', 'GetDashboardClips');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    dashboardSave(dashboard): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', dashboard.id.toString())
            .set('name', dashboard.name.toString())
            .set('isactive', dashboard.isactive.toString())
            .set('timeselection', dashboard.timeselection.toString())
            .set('groupselection', dashboard.groupselection.toString())
            .set('method', 'dashboard_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
    dashboardDelete(dashboardid): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', dashboardid.toString())
            .set('method', 'dashboard_delete');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    dashboard_clip_save(widgets: any = []): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": widgets,
            "method": "dashboard_clip_save",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body, {
            headers: header_detail,
        });
    }

    // getWidgets(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get('api/analytics-dashboard-widgets')
    //             .subscribe((response: any) => {
    //                 this.widgets = response;
    //                 resolve(response);
    //             }, reject);
    //     });
    // }
}