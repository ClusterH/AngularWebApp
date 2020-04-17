import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ReportDetail } from "app/main/report/reportcomponent/model/report.model";

@Injectable()
export class ReportResultService
{
    // report: any[];
    report_cList: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }  
       
    loadReportResult(conncode: string, userid: number, pageindex: number, pagesize: number): Observable<any>
    {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        let params = new HttpParams()
        .set('conncode', conncode.toString())
        .set('userid', userid.toString())
        .set('pageindex', (pageindex + 1).toString())
        .set('pagesize', pagesize.toString());
        
        let report_param = JSON.parse(localStorage.getItem('report_result'));
        console.log(report_param);

        for (let param in report_param) { 
           
                console.log(`${param}`, report_param[param]);
                if (param == 'reportname') {
                    params = params.set('method', report_param[param].toString());
                } else {
                    params = params.set(`${param}`, report_param[param].toString());
                }
        }
        
        console.log('params', params);

        console.log(report_param);
       
        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
            headers: headers,   
            params: params
        });
    }

    
}
