import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DealercompanyDetailService {
    routeParams: any;
    dealercompany: any;
    public dealercompany_detail: any;
    public dealercompany_clist_item: any = {};

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

    getDealercompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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

    saveDealercompanyDetail(dealercompanyDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', dealercompanyDetail.id.toString())
            .set('name', dealercompanyDetail.name.toString())
            .set('orgno', dealercompanyDetail.orgno.toString())
            .set('accountid', dealercompanyDetail.accountid.toString())
            .set('dealercompanytypeid', dealercompanyDetail.dealercompanytypeid.toString())
            .set('userprofileid', dealercompanyDetail.userprofileid.toString())
            .set('isactive', dealercompanyDetail.isactive.toString())
            .set('created', dealercompanyDetail.created.toString())
            .set('createdby', dealercompanyDetail.createdby.toString())
            .set('deletedwhen', dealercompanyDetail.deletedwhen.toString())
            .set('deletedby', dealercompanyDetail.deletedby.toString())
            .set('lastmodifieddate', dealercompanyDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', dealercompanyDetail.lastmodifiedby.toString())
            .set('emailserver', dealercompanyDetail.emailserver.toString())
            .set('emailsender', dealercompanyDetail.emailsender.toString())
            .set('emailuser', dealercompanyDetail.emailuser.toString())
            .set('emailpassword', dealercompanyDetail.emailpassword.toString())
            .set('logofile', dealercompanyDetail.logofile.toString())
            .set('address', dealercompanyDetail.address.toString())
            .set('country', dealercompanyDetail.country.toString())
            .set('contactname', dealercompanyDetail.contactname.toString())
            .set('phone', dealercompanyDetail.phone.toString())
            .set('email', dealercompanyDetail.email.toString())
            .set('comments', dealercompanyDetail.comments.toString())
            .set('billingnote', dealercompanyDetail.billingnote.toString())
            .set('webstartlat', dealercompanyDetail.webstartlat.toString())
            .set('webstartlong', dealercompanyDetail.webstartlong.toString())
            .set('hasprivatelabel', dealercompanyDetail.hasprivatelabel.toString())
            .set('method', 'dealercompany_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}
