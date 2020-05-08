import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EventDetailService 
{
    routeParams: any;
    event: any;
    public event_detail: any;
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

    saveEventDetail(conncode: string, userid: number, eventDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        console.log(eventDetail);

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', eventDetail.id.toString())
            .set('name', eventDetail.name.toString())
            .set('email', eventDetail.email.toString())
            // .set('password', eventDetail.password.toString())
            .set('eventprofileid', eventDetail.eventprofileid.toString())
            .set('timezoneid', eventDetail.timezoneid.toString())
            .set('lengthunitid', eventDetail.lengthunitid.toString())
            .set('fuelunitid', eventDetail.fuelunitid.toString())
            .set('weightunitid', eventDetail.weightunitid.toString())
            .set('tempunitid', eventDetail.tempunitid.toString())
            .set('isactive', eventDetail.isactive.toString())
            .set('companyid', eventDetail.companyid.toString())
            .set('groupid', eventDetail.groupid.toString())
            .set('subgroup', eventDetail.subgroup.toString())
            .set('created', eventDetail.created.toString())
            .set('createdby', eventDetail.createdby.toString())
            .set('deletedwhen', eventDetail.deletedwhen.toString())
            .set('deletedby', eventDetail.deletedby.toString())
            .set('lastmodifieddate', eventDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', eventDetail.lastmodifiedby.toString())
            .set('languageid', eventDetail.languageid.toString())
            .set('method', 'event_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
