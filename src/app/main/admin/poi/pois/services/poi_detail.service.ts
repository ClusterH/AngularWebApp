import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PoiDetailService 
{
    routeParams: any;
    poi: any;
    public poi_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

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

    savePoiDetail(conncode: string, userid: number, poiDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', poiDetail.id.toString())
            .set('name', poiDetail.name.toString())
            .set('companyid', poiDetail.companyid.toString())
            .set('groupid', poiDetail.groupid.toString())
            .set('subgroup', poiDetail.subgroup.toString())
            .set('radius', poiDetail.operatorid.toString())
            .set('pointid', poiDetail.accountid.toString())
            .set('pointtypeid', poiDetail.unittypeid.toString())
            .set('address', poiDetail.serviceplanid.toString())
            .set('latitude', poiDetail.producttypeid.toString())
            .set('longitude', poiDetail.makeid.toString())
            .set('isactive', poiDetail.isactive.toString())
            .set('created', poiDetail.created.toString())
            .set('createdby', poiDetail.createdby.toString())
            .set('deletedwhen', poiDetail.deletedwhen.toString())
            .set('deletedby', poiDetail.deletedby.toString())
            .set('lastmodifieddate', poiDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', poiDetail.lastmodifiedby.toString())
            .set('method', 'poi_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
