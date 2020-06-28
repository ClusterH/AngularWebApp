import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FuelregistryDetailService 
{
    routeParams: any;
    fuelregistry: any;
    public fuelregistry_detail: any;
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

    getDetails(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string): Observable<any>
    {
        console.log(conncode, userid, pageindex, pagesize, name, method);
        
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
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

    saveFuelregistryDetail(conncode: string, userid: number, fuelregistryDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', fuelregistryDetail.id.toString())
            .set('name', fuelregistryDetail.name.toString())
            .set('email', fuelregistryDetail.email.toString())
            // .set('password', fuelregistryDetail.password.toString())
            .set('fuelregistryprofileid', fuelregistryDetail.fuelregistryprofileid.toString())
            .set('timezoneid', fuelregistryDetail.timezoneid.toString())
            .set('lengthunitid', fuelregistryDetail.lengthunitid.toString())
            .set('fuelunitid', fuelregistryDetail.fuelunitid.toString())
            .set('weightunitid', fuelregistryDetail.weightunitid.toString())
            .set('tempunitid', fuelregistryDetail.tempunitid.toString())
            .set('isactive', fuelregistryDetail.isactive.toString())
            .set('companyid', fuelregistryDetail.companyid.toString())
            .set('groupid', fuelregistryDetail.groupid.toString())
            .set('subgroup', fuelregistryDetail.subgroup.toString())
            .set('created', fuelregistryDetail.created.toString())
            .set('createdby', fuelregistryDetail.createdby.toString())
            .set('deletedwhen', fuelregistryDetail.deletedwhen.toString())
            .set('deletedby', fuelregistryDetail.deletedby.toString())
            .set('lastmodifieddate', fuelregistryDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', fuelregistryDetail.lastmodifiedby.toString())
            .set('languageid', fuelregistryDetail.languageid.toString())
            .set('method', 'fuelregistry_save');
        
            

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
