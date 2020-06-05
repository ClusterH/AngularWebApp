import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class VehicleDetailService 
{
    routeParams: any;
    vehicle: any;
    public vehicle_detail: any;
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
        console.log("SERVICE-getCompanies() :", method);
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            if(method == 'model_clist') {
                console.log(this.current_makeID);

                let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('makeid', this.current_makeID.toString())
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

            if(method == 'model_clist') {
                console.log(this.current_makeID);

                let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('makeid', this.current_makeID.toString())
                .set('name', `^${name}^`) 
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

    getGroups(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        console.log(pageindex, pagesize,  companyid);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('companyid', companyid.toString())
            .set('method', 'group_CList');
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('name', `^${name}^`) 
            .set('companyid', companyid.toString())
            .set('method', 'group_CList');
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
        
    }

    saveVehicleDetail(conncode: string, userid: number, vehicleDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', vehicleDetail.id.toString())
            .set('name', vehicleDetail.name.toString())
            .set('companyid', vehicleDetail.companyid.toString())
            .set('groupid', vehicleDetail.groupid.toString())
            .set('subgroup', vehicleDetail.subgroup.toString())
            .set('operatorid', vehicleDetail.operatorid.toString())
            .set('accountid', vehicleDetail.accountid.toString())
            .set('unittypeid', vehicleDetail.unittypeid.toString())
            .set('serviceplanid', vehicleDetail.serviceplanid.toString())
            .set('producttypeid', vehicleDetail.producttypeid.toString())
            .set('makeid', vehicleDetail.makeid.toString())
            .set('modelid', vehicleDetail.modelid.toString())
            .set('isactive', vehicleDetail.isactive.toString())
            .set('timezoneid', vehicleDetail.timezoneid.toString())
            .set('created', vehicleDetail.created.toString())
            .set('createdby', vehicleDetail.createdby.toString())
            .set('deletedwhen', vehicleDetail.deletedwhen.toString())
            .set('deletedby', vehicleDetail.deletedby.toString())
            .set('lastmodifieddate', vehicleDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', vehicleDetail.lastmodifiedby.toString())
            .set('method', 'unit_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
