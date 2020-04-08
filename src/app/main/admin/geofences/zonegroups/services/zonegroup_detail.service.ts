import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ZonegroupDetailService 
{
    routeParams: any;
    zonegroup: any;
    public zonegroup_detail: any;
    public unit_clist_item: any = {};
    public current_zoneGroupID: number = 0;
    public current_CompanyID: number = 0;

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
        console.log(this.current_CompanyID, name, method);
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        if(name == '') {
            if (method == "GetGroupIncludedZONEs" || method == "GetGroupExcludedZONEs") {
                if (this.current_CompanyID > 0) {
                    console.log(this.current_CompanyID);
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('companyid', this.current_CompanyID.toString())
                        .set('method', method.toString());

                    return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                        headers: headers,   
                        params:  params
                    });
                } else if (this.current_zoneGroupID > 0){
                    console.log(method, this.current_zoneGroupID);
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('zonegroupid', this.current_zoneGroupID.toString())
                        .set('method', method.toString());

                    return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                        headers: headers,   
                        params:  params
                    });
                }
            } else {
                console.log(name, method);
                let params = new HttpParams()
                    .set('conncode', conncode.toString())
                    .set('userid', userid.toString())
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());

                return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                    headers: headers,   
                    params:  params
                });
            }
        } else {
            if (method == "GetGroupIncludedZONEs" || method == "GetGroupExcludedZONEs") {
                if (this.current_CompanyID > 0) {
                    console.log(this.current_CompanyID);
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('name', `^${name}^`)
                        .set('companyid', this.current_CompanyID.toString())
                        .set('method', method.toString());

                    return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                        headers: headers,   
                        params:  params
                    });

                } else if (this.current_zoneGroupID > 0){
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('name', `^${name}^`)
                        .set('zonegroupid', this.current_zoneGroupID.toString())
                        .set('method', method.toString());
                        
                    return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                        headers: headers,   
                        params:  params
                    });
                }
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
                    params:  params
                });
            }
        }
    }

    saveZonegroupDetail(conncode: string, userid: number, zonegroupDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', zonegroupDetail.id.toString())
            .set('name', zonegroupDetail.name.toString())
            .set('companyid', zonegroupDetail.companyid.toString())
            .set('isactive', zonegroupDetail.isactive.toString())
            .set('created', zonegroupDetail.created.toString())
            .set('createdby', zonegroupDetail.createdby.toString())
            .set('deletedwhen', zonegroupDetail.deletedwhen.toString())
            .set('deletedby', zonegroupDetail.deletedby.toString())
            .set('lastmodifieddate', zonegroupDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', zonegroupDetail.lastmodifiedby.toString())
            .set('method', 'zonegroup_save');

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    addZoneToGroup(conncode: string, userid: number, zoneArray: any = []): Observable<any> {
        console.log(zoneArray);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_data = {
            'conncode': conncode.toString(),
            'userid': userid.toString(),
            'data': zoneArray,
            'method': 'zonegroup_AddZONE'
        }

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(params_data), {
            headers: header_detail
        });
    }

    deleteZoneToGroup(conncode: string, userid: number, zoneArray: any = []): Observable<any> {
        console.log(zoneArray);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_data = {
            'conncode': conncode.toString(),
            'userid': userid.toString(),
            'data': zoneArray,
            'method': 'zonegroup_DeleteZONE'
        }

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(params_data), {
            headers: header_detail,
        });
    }
}
