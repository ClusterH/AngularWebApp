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
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (filterString == '') {
            if (categoryid == 0) {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('categoryid', categoryid.toString())
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        } else {
            if (categoryid == 0) {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('name', `^${filterString}^`.toString())
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('categoryid', categoryid.toString())
                    .set('name', `^${filterString}^`.toString())
                    .set('method', method.toString());
                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        }
    }

    getReportParams(reportid: number, apimethod: any): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('reportid', reportid.toString())
            .set('method', apimethod.toString())
            .set('requesttype', 'param');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    loadGroup(pageindex: number, pagesize: number, selectedid: any, filterString: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (method == 'group_clist') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', selectedid.toString())
                .set('name', `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else if (method == 'unit_clist') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('groupid', selectedid.toString())
                .set('name', `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    deleteVehicle(id: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams();
        params
            .set('id', id.toString())
            .set('method', "unit_delete");
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}