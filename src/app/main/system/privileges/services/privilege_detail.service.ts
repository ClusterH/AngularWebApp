import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PrivilegeDetailService 
{
    routeParams: any;
    privilege: any;
    public privilege_detail: any;
    public unit_clist_item: any = {};
    public current_typeID: number;

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

    getCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, name: string,  method: string): Observable<any>
    {
        
        // if (typeid == undefined) {
        //     typeid = 0;
        // }

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            if (method == 'privobject_clist') {
                let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('typeid', this.current_typeID.toString())
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
                .set('method', method.toString());
    
                return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                    headers: headers,   
                    params: params
                });
            }
        } else {
            if (method == 'privobject_clist') {
                let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('typeid', this.current_typeID.toString())
                .set('name', `^${name}^`) 
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
    }

    savePrivilegeDetail(conncode: string, userid: number, privilegeDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', privilegeDetail.id.toString())
            .set('isactive', privilegeDetail.isactive.toString())
            .set('name', privilegeDetail.name.toString())
            .set('typeid', privilegeDetail.typeid.toString())
            .set('objectid', privilegeDetail.objectid.toString())
            .set('method', 'privilege_save');
        
            

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
