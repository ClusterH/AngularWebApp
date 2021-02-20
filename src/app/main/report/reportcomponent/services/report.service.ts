import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ReportService {
    report_cList: any[];
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getReports(pageindex: number, pagesize: number, categoryid: any, filterString: string, method: string): Observable<any> {
        if (filterString == '') {
            if (categoryid == 0) {
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
                    .set('categoryid', categoryid.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            }
        } else {
            if (categoryid == 0) {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('name', `^${filterString}^`.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            } else {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('categoryid', categoryid.toString())
                    .set('name', `^${filterString}^`.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            }
        }
    }

    getReportParams(reportid: number, apimethod: any): Observable<any> {
        const params = new HttpParams()
            .set('reportid', reportid.toString())
            .set('method', apimethod.toString())
            .set('requesttype', 'param');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    loadGroup(pageindex: number, pagesize: number, selectedid: any, filterString: string, method: string): Observable<any> {
        if (method == 'group_clist') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', selectedid.toString())
                .set('name', `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else if (method == 'unit_clist') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('groupid', selectedid.toString())
                .set('name', `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    deleteVehicle(id: number): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "unit_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }
}