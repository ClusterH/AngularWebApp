import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserProfileDetailService 
{
    routeParams: any;
    userprofile: any;
    public userprofile_detail: any;
    public unit_clist_item: any = {};
    public current_userprofileID: number;

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

    getPrivilegeAccess(conncode: string, userid: number, userprofileid: number, typeid: number){
        const headers = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('userprofileid', userprofileid.toString())
            .set('typeid', typeid.toString())
            .set('method', 'get_privilege_access');
        
            console.log(params);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    saveUserProfileDetail(conncode: string, userid: number, userprofileDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', userprofileDetail.id.toString())
            .set('name', userprofileDetail.name.toString())
            .set('isactive', userprofileDetail.isactive.toString())
            .set('createdby', userprofileDetail.createdby.toString())
            .set('created', userprofileDetail.createdwhen.toString())
            .set('lastmodifiedby', userprofileDetail.lastmodifiedby.toString())
            .set('lastmodifieddate', userprofileDetail.lastmodifieddate.toString())
            .set('method', 'userprofile_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
