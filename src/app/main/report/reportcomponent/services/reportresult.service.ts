import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ReportResultService {
    report_cList: any[];
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    loadReportResult(pageindex: number, pagesize: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString());
        let report_param = JSON.parse(localStorage.getItem('report_result'));

        for (let param in report_param) {
            if (param == 'reportname') {
                params = params.set('method', report_param[param].toString());
            } else if (param != 'companyname' && param != 'groupname') {
                params = params.set(`${param}`, report_param[param].toString());
            }
        }

        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    loadCompanyGroup(pageindex: number, pagesize: number, currentid: number, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString());
        let report_param = JSON.parse(localStorage.getItem('report_result'));
        for (let param in report_param) {
            if (param == 'reportname') {
                params = params.set('method', report_param[param].toString());
            } else {
                params = params.set(`${param}`, report_param[param].toString());
            }
        }
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}