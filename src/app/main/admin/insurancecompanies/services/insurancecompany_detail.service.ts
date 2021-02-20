import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class InsurancecompanyDetailService {
    routeParams: any;
    insurancecompany: any;
    public insurancecompany_detail: any;
    public insurancecompany_clist_item: any = {};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
    }

    getInsurancecompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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

    saveInsurancecompanyDetail(insurancecompanyDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', insurancecompanyDetail.id.toString())
            .set('name', insurancecompanyDetail.name.toString())
            .set('orgno', insurancecompanyDetail.orgno.toString())
            .set('accountid', insurancecompanyDetail.accountid.toString())
            .set('insurancecompanytypeid', insurancecompanyDetail.insurancecompanytypeid.toString())
            .set('userprofileid', insurancecompanyDetail.userprofileid.toString())
            .set('isactive', insurancecompanyDetail.isactive.toString())
            .set('created', insurancecompanyDetail.created.toString())
            .set('createdby', insurancecompanyDetail.createdby.toString())
            .set('deletedwhen', insurancecompanyDetail.deletedwhen.toString())
            .set('deletedby', insurancecompanyDetail.deletedby.toString())
            .set('lastmodifieddate', insurancecompanyDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', insurancecompanyDetail.lastmodifiedby.toString())
            .set('emailserver', insurancecompanyDetail.emailserver.toString())
            .set('emailsender', insurancecompanyDetail.emailsender.toString())
            .set('emailuser', insurancecompanyDetail.emailuser.toString())
            .set('emailpassword', insurancecompanyDetail.emailpassword.toString())
            .set('logofile', insurancecompanyDetail.logofile.toString())
            .set('address', insurancecompanyDetail.address.toString())
            .set('country', insurancecompanyDetail.country.toString())
            .set('contactname', insurancecompanyDetail.contactname.toString())
            .set('phone', insurancecompanyDetail.phone.toString())
            .set('email', insurancecompanyDetail.email.toString())
            .set('comments', insurancecompanyDetail.comments.toString())
            .set('billingnote', insurancecompanyDetail.billingnote.toString())
            .set('webstartlat', insurancecompanyDetail.webstartlat.toString())
            .set('webstartlong', insurancecompanyDetail.webstartlong.toString())
            .set('hasprivatelabel', insurancecompanyDetail.hasprivatelabel.toString())
            .set('method', 'insurancecompany_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}