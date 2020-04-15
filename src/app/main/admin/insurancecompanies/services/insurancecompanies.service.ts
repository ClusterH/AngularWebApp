import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class InsuranceCompaniesService
{
    insurancecompanies: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }
    
    getInsuranceCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any>
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
                .set('companytypeid', '3')
                .set('method', method.toString());
               
            console.log('params', params);

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
                .set('companytypeid', '3')
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());

            console.log('params', params);

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
    // deleteInsuranceCompany(insurancecompany): void
    // {
    //     const insurancecompanyIndex = this.insurancecompanies.indexOf(insurancecompany);
    //     this.insurancecompanies.splice(insurancecompanyIndex, 1);
    //     this.onInsuranceCompaniesChanged.next(this.insurancecompanies);
    // }

    // duplicateInsuranceCompany(insurancecompany): void
    // {
    //     const insurancecompanyIndex = this.insurancecompanies.indexOf(insurancecompany);
    //     this.insurancecompanies.splice(insurancecompanyIndex, 0, insurancecompany);
    //     this.onInsuranceCompaniesChanged.next(this.insurancecompanies);
    // }
}
