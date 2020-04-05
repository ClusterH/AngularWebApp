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
    public current_poiGroupID: number;
    public current_pagePOIs: any = [];
    public selectedPOIs: any = [];

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
        console.log("SERVICE-getCompanies() :", name, method);
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            if (method == "GetGroupIncludedPOIs" || method == "GetGroupExcludedPOIs") {
                let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('poigroupid', this.current_poiGroupID.toString())
                .set('method', method.toString());


                console.log(params);
    
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
                .set('method', method.toString());
    
                return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                    headers: headers,   
                    params: params
                });
            }
            
           
        } else {
            if (method == "GetGroupIncludedPOIs" || method == "GetGroupExcludedPOIs") {
                let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('poigroupid', this.current_poiGroupID.toString())
                .set('method', method.toString());

                console.log(params);

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
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
