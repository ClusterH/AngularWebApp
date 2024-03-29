import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CompaniesService {
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

    getCompanies(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        if (filterItem == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    deleteCompany(id: number): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "company_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    // duplicateCompany(company): void
    // {
    //     const companyIndex = this.companies.indexOf(company);
    //     this.companies.splice(companyIndex, 0, company);
    //     this.onCompaniesChanged.next(this.companies);
    // }
}
