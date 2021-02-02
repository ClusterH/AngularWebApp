import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class InsurancecompaniesService {
    insurancecompanies: any[];
    insurancecompanyList: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }

    getInsurancecompanies(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (filterItem == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    deleteInsurancecompany(id: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', "insurancecompany_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    // duplicateInsurancecompany(insurancecompany): void
    // {
    //     const insurancecompanyIndex = this.insurancecompanies.indexOf(insurancecompany);
    //     this.insurancecompanies.splice(insurancecompanyIndex, 0, insurancecompany);
    //     this.onInsurancecompaniesChanged.next(this.insurancecompanies);
    // }
}
