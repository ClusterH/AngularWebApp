import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserDetailService {
    user: any;
    public user_detail: any;
    public unit_clist_item: any = {};

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

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_Clist');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', 'group_Clist');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getSystemPageClist(): Observable<any> {
        const params = new HttpParams()
            .set('method', 'SystemPage_CList');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    saveUserDetail(userDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', userDetail.id.toString())
            .set('name', userDetail.name.toString())
            .set('email', userDetail.email.toString())
            .set('password', userDetail.password.toString())
            .set('userprofileid', userDetail.userprofileid.toString())
            .set('timezoneid', userDetail.timezoneid.toString())
            .set('lengthunitid', userDetail.lengthunitid.toString())
            .set('fuelunitid', userDetail.fuelunitid.toString())
            .set('weightunitid', userDetail.weightunitid.toString())
            .set('tempunitid', userDetail.tempunitid.toString())
            .set('isactive', userDetail.isactive.toString())
            .set('companyid', userDetail.companyid.toString())
            .set('groupid', userDetail.groupid.toString())
            .set('subgroup', userDetail.subgroup.toString())
            .set('created', userDetail.created.toString())
            .set('createdby', userDetail.createdby.toString())
            .set('deletedwhen', userDetail.deletedwhen.toString())
            .set('deletedby', userDetail.deletedby.toString())
            .set('lastmodifieddate', userDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', userDetail.lastmodifiedby.toString())
            .set('languageid', userDetail.languageid.toString())
            .set('startpageid', userDetail.startpageid.toString())
            .set('method', 'user_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}