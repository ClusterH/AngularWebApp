import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DealerCompaniesService {
    dealercompanies: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }

    getDealerCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (filterItem == '') {
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('companytypeid', '2')
                .set('method', method.toString());



            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            // filterString = "%" + filterString + "%";
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('companytypeid', '2')
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());



            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    /**
     * Delete contact
     *
    //  * @param contact
     */
    // deleteDealerCompany(dealercompany): void
    // {
    //     const dealercompanyIndex = this.dealercompanies.indexOf(dealercompany);
    //     this.dealercompanies.splice(dealercompanyIndex, 1);
    //     this.onDealerCompaniesChanged.next(this.dealercompanies);
    // }

    // duplicateDealerCompany(dealercompany): void
    // {
    //     const dealercompanyIndex = this.dealercompanies.indexOf(dealercompany);
    //     this.dealercompanies.splice(dealercompanyIndex, 0, dealercompany);
    //     this.onDealerCompaniesChanged.next(this.dealercompanies);
    // }
}
