import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MaintserviceDetailService 
{
    routeParams: any;
    maintservice: any;
    public maintservice_detail: any;
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

    saveMaintserviceDetail(conncode: string, userid: number, maintserviceDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        console.log(maintserviceDetail);

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', maintserviceDetail.id.toString())
            .set('name', maintserviceDetail.name.toString())
            .set('email', maintserviceDetail.email.toString())
            // .set('password', maintserviceDetail.password.toString())
            .set('maintserviceprofileid', maintserviceDetail.maintserviceprofileid.toString())
            .set('timezoneid', maintserviceDetail.timezoneid.toString())
            .set('lengthunitid', maintserviceDetail.lengthunitid.toString())
            .set('fuelunitid', maintserviceDetail.fuelunitid.toString())
            .set('weightunitid', maintserviceDetail.weightunitid.toString())
            .set('tempunitid', maintserviceDetail.tempunitid.toString())
            .set('isactive', maintserviceDetail.isactive.toString())
            .set('companyid', maintserviceDetail.companyid.toString())
            .set('groupid', maintserviceDetail.groupid.toString())
            .set('subgroup', maintserviceDetail.subgroup.toString())
            .set('created', maintserviceDetail.created.toString())
            .set('createdby', maintserviceDetail.createdby.toString())
            .set('deletedwhen', maintserviceDetail.deletedwhen.toString())
            .set('deletedby', maintserviceDetail.deletedby.toString())
            .set('lastmodifieddate', maintserviceDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', maintserviceDetail.lastmodifiedby.toString())
            .set('languageid', maintserviceDetail.languageid.toString())
            .set('method', 'maintservice_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
