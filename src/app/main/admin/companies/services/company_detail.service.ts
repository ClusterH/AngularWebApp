import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyDetailService {
    routeParams: any;
    company: any;
    public company_detail: any;
    public company_clist_item: any = {};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
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
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    saveCompanyDetail(companyDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', companyDetail.id.toString())
            .set('name', companyDetail.name.toString())
            .set('orgno', companyDetail.orgno.toString())
            .set('accountid', companyDetail.accountid.toString())
            .set('companytypeid', companyDetail.companytypeid.toString())
            .set('userprofileid', companyDetail.userprofileid.toString())
            .set('isactive', companyDetail.isactive.toString())
            .set('created', companyDetail.created.toString())
            .set('createdby', companyDetail.createdby.toString())
            .set('deletedwhen', companyDetail.deletedwhen.toString())
            .set('deletedby', companyDetail.deletedby.toString())
            .set('lastmodifieddate', companyDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', companyDetail.lastmodifiedby.toString())
            .set('emailserver', companyDetail.emailserver.toString())
            .set('emailsender', companyDetail.emailsender.toString())
            .set('emailuser', companyDetail.emailuser.toString())
            .set('emailpassword', companyDetail.emailpassword.toString())
            .set('logofile', companyDetail.logofile.toString())
            .set('address', companyDetail.address.toString())
            .set('country', companyDetail.country.toString())
            .set('contactname', companyDetail.contactname.toString())
            .set('phone', companyDetail.phone.toString())
            .set('email', companyDetail.email.toString())
            .set('comments', companyDetail.comments.toString())
            .set('billingnote', companyDetail.billingnote.toString())
            .set('webstartlat', companyDetail.webstartlat.toString())
            .set('webstartlong', companyDetail.webstartlong.toString())
            .set('hasprivatelabel', companyDetail.hasprivatelabel.toString())
            .set('method', 'company_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}
