import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class OperatorDetailService 
{
    routeParams: any;
    operator: any;
    public operator_detail: any;
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

    saveOperatorDetail(conncode: string, userid: number, operatorDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', operatorDetail.id.toString())
            .set('name', operatorDetail.name.toString())
            .set('email', operatorDetail.email.toString())
            .set('password', operatorDetail.password.toString())
            .set('phonenumber', operatorDetail.phonenumber.toString())
            .set('operatortypeid', operatorDetail.operatortypeid.toString())
            .set('isactive', operatorDetail.isactive.toString())
            .set('companyid', operatorDetail.companyid.toString())
            .set('groupid', operatorDetail.groupid.toString())
            .set('subgroup', operatorDetail.subgroup.toString())
            .set('created', operatorDetail.created.toString())
            .set('createdby', operatorDetail.createdby.toString())
            .set('deletedwhen', operatorDetail.deletedwhen.toString())
            .set('deletedby', operatorDetail.deletedby.toString())
            .set('lastmodifieddate', operatorDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', operatorDetail.lastmodifiedby.toString())
            // .set('filephoto', operatorDetail.filephoto)
            .set('birthdate', operatorDetail.birthdate.toString())
            .set('sin', operatorDetail.sin.toString())
            .set('hiredate', operatorDetail.hiredate.toString())
            .set('physicaltestexpirydate', operatorDetail.physicaltestexpirydate.toString())
            .set('licenseexpirationdate', operatorDetail.licenseexpirationdate.toString())
            .set('driverlicensenumber', operatorDetail.driverlicensenumber.toString())
            .set('method', 'operator_save');
        
            

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}
