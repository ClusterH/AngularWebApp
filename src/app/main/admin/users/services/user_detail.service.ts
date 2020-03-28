import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserDetailService 
{
    routeParams: any;
    user: any;
    public user_detail: any;
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

    saveUserDetail(conncode: string, userid: number, userDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        console.log(userDetail);

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', userDetail.id.toString())
            .set('name', userDetail.name.toString())
            .set('email', userDetail.email.toString())
            // .set('password', userDetail.password.toString())
            .set('userprofileid', userDetail.userprofileid.toString())
            .set('timezoneid', userDetail.timezoneid.toString())
            .set('lengthunitid', userDetail.lengthunitid.toString())
            .set('fuelunitid', userDetail.fuelunitid.toString())
            .set('weightunitid', userDetail.weightunitid.toString())
            .set('tempunitid', userDetail.tempunitid.toString())
            .set('isactive', userDetail.isactive.toString())
            .set('companyid', userDetail.companyid.toString())
            .set('groupid', userDetail.groupid.toString())
            .set('subgroup', userDetail.subgroup.toString())
            .set('created', userDetail.created.toString())
            .set('createdby', userDetail.createdby.toString())
            .set('deletedwhen', userDetail.deletedwhen.toString())
            .set('deletedby', userDetail.deletedby.toString())
            .set('lastmodifieddate', userDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', userDetail.lastmodifiedby.toString())
            .set('languageid', userDetail.languageid.toString())
            .set('method', 'user_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
