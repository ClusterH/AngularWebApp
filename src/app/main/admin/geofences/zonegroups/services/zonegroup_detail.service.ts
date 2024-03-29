import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ZonegroupDetailService {
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
    ) {
        // Set the defaults
    }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            if (method == "GetGroupIncludedZONEs" || method == "GetGroupExcludedZONEs") {
                if (this.current_CompanyID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('companyid', this.current_CompanyID.toString())
                        .set('method', method.toString());
                    return this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    });
                } else if (this.current_zoneGroupID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('zonegroupid', this.current_zoneGroupID.toString())
                        .set('method', method.toString());
                    return this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    });
                }
            } else {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            }
        } else {
            if (method == "GetGroupIncludedZONEs" || method == "GetGroupExcludedZONEs") {
                if (this.current_CompanyID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('name', `^${name}^`)
                        .set('companyid', this.current_CompanyID.toString())
                        .set('method', method.toString());
                    return this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    });
                } else if (this.current_zoneGroupID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('name', `^${name}^`)
                        .set('zonegroupid', this.current_zoneGroupID.toString())
                        .set('method', method.toString());
                    return this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    });
                }
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
    }

    saveZonegroupDetail(zonegroupDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
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
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    addZoneToGroup(zoneArray: any = []): Observable<any> {
        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": zoneArray,
            "method": "zonegroup_AddZONE",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }

    deleteZoneToGroup(zoneArray: any = []): Observable<any> {
        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": zoneArray,
            "method": "zonegroup_DeleteZONE",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }
}