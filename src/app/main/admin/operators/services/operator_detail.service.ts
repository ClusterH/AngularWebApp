import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class OperatorDetailService {
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
    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getGroup(pageindex: number, pagesize: number, name: string, companyid: number, method: string): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }
    GetOperatorImage(id: number): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', id.toString())
            .set('method', 'GetOperatorImage');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    saveOperatorImage(id: number, filephoto: string): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;

        const header_detail = new HttpHeaders()
            .append("Access-Control-Allow-Origin", "*")
            .append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        const body = {
            "id": id,
            "filephoto": filephoto,
            "method": "SaveOperatorImage",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }

        return this._httpClient.post('trackingxlapi.ashx', body, {
            headers: header_detail,
        });
    }

    saveOperatorDetail(operatorDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
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
            .set('birthdate', operatorDetail.birthdate.toString())
            .set('sin', operatorDetail.sin.toString())
            .set('hiredate', operatorDetail.hiredate.toString())
            .set('physicaltestexpirydate', operatorDetail.physicaltestexpirydate.toString())
            .set('licenseexpirationdate', operatorDetail.licenseexpirationdate.toString())
            .set('driverlicensenumber', operatorDetail.driverlicensenumber.toString())
            .set('method', 'operator_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}