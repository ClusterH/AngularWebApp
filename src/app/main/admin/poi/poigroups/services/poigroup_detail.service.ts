import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PoigroupDetailService 
{
    routeParams: any;
    poigroup: any;
    public poigroup_detail: any;
    public unit_clist_item: any = {};
    public current_poiGroupID: number = 0;
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
        
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        if(name == '') {
            if (method == "GetGroupIncludedPOIs" || method == "GetGroupExcludedPOIs") {
                if (this.current_CompanyID > 0) {
                    
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
                } else if (this.current_poiGroupID > 0){
                    
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('poigroupid', this.current_poiGroupID.toString())
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
                    .set('method', method.toString());

                return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                    headers: headers,   
                    params:  params
                });
            }
        } else {
            if (method == "GetGroupIncludedPOIs" || method == "GetGroupExcludedPOIs") {
                if (this.current_CompanyID > 0) {
                    
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

                } else if (this.current_poiGroupID > 0){
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('name', `^${name}^`)
                        .set('poigroupid', this.current_poiGroupID.toString())
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

    savePoigroupDetail(conncode: string, userid: number, poigroupDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', poigroupDetail.id.toString())
            .set('name', poigroupDetail.name.toString())
            .set('companyid', poigroupDetail.companyid.toString())
            .set('isactive', poigroupDetail.isactive.toString())
            .set('created', poigroupDetail.created.toString())
            .set('createdby', poigroupDetail.createdby.toString())
            .set('deletedwhen', poigroupDetail.deletedwhen.toString())
            .set('deletedby', poigroupDetail.deletedby.toString())
            .set('lastmodifieddate', poigroupDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', poigroupDetail.lastmodifiedby.toString())
            .set('method', 'poigroup_save');

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    addPoiToGroup(conncode: string, userid: number, poiArray: any = []): Observable<any> {
        
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_data = {
            'conncode': conncode.toString(),
            'userid': userid.toString(),
            'data': poiArray,
            'method': 'poigroup_AddPOI'
        }

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(params_data), {
            headers: header_detail
        });
    }

    deletePoiToGroup(conncode: string, userid: number, poiArray: any = []): Observable<any> {
        
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_data = {
            'conncode': conncode.toString(),
            'userid': userid.toString(),
            'data': poiArray,
            'method': 'poigroup_DeletePOI'
        }

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(params_data), {
            headers: header_detail,
        });
    }
}
