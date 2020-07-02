import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CompaniesService
{
    companies: any[];
    companyList: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }
    
    getCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any>
    {
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
                .set('method', method.toString());
               
            

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
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
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());

            

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
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
    // deleteCompany(company): void
    // {
    //     const companyIndex = this.companies.indexOf(company);
    //     this.companies.splice(companyIndex, 1);
    //     this.onCompaniesChanged.next(this.companies);
    // }

    // duplicateCompany(company): void
    // {
    //     const companyIndex = this.companies.indexOf(company);
    //     this.companies.splice(companyIndex, 0, company);
    //     this.onCompaniesChanged.next(this.companies);
    // }
}
