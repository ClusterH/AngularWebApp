import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ServiceitemDetailService 
{
    routeParams: any;
    serviceitem: any;
    public serviceitem_detail: any;
    public unit_clist_item: any = {};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
    }

    getCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string): Observable<any>
    {
        console.log("SERVICE-getCompanies() :", method);
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('method', method.toString());

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
           
        } else {
            let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('name', `^${name}^`) 
            .set('method', method.toString());

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        }
        
    }

    saveServiceitemDetail(conncode: string, userid: number, serviceitemDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        console.log(serviceitemDetail);

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', serviceitemDetail.id.toString())
            .set('name', serviceitemDetail.name.toString())
            .set('email', serviceitemDetail.email.toString())
            // .set('password', serviceitemDetail.password.toString())
            .set('serviceitemprofileid', serviceitemDetail.serviceitemprofileid.toString())
            .set('timezoneid', serviceitemDetail.timezoneid.toString())
            .set('lengthunitid', serviceitemDetail.lengthunitid.toString())
            .set('fuelunitid', serviceitemDetail.fuelunitid.toString())
            .set('weightunitid', serviceitemDetail.weightunitid.toString())
            .set('tempunitid', serviceitemDetail.tempunitid.toString())
            .set('isactive', serviceitemDetail.isactive.toString())
            .set('companyid', serviceitemDetail.companyid.toString())
            .set('groupid', serviceitemDetail.groupid.toString())
            .set('subgroup', serviceitemDetail.subgroup.toString())
            .set('created', serviceitemDetail.created.toString())
            .set('createdby', serviceitemDetail.createdby.toString())
            .set('deletedwhen', serviceitemDetail.deletedwhen.toString())
            .set('deletedby', serviceitemDetail.deletedby.toString())
            .set('lastmodifieddate', serviceitemDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', serviceitemDetail.lastmodifiedby.toString())
            .set('languageid', serviceitemDetail.languageid.toString())
            .set('method', 'serviceitem_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
