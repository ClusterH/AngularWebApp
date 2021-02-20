import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PoigroupDetailService {
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
    ) {
        // Set the defaults
    }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            if (method == "GetGroupIncludedPOIs" || method == "GetGroupExcludedPOIs") {
                if (this.current_CompanyID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('companyid', this.current_CompanyID.toString())
                        .set('method', method.toString());
                    return this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    });
                } else if (this.current_poiGroupID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('poigroupid', this.current_poiGroupID.toString())
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
            if (method == "GetGroupIncludedPOIs" || method == "GetGroupExcludedPOIs") {
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
                } else if (this.current_poiGroupID > 0) {
                    const params = new HttpParams()
                        .set('pageindex', (pageindex + 1).toString())
                        .set('pagesize', pagesize.toString())
                        .set('name', `^${name}^`)
                        .set('poigroupid', this.current_poiGroupID.toString())
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

    savePoigroupDetail(poigroupDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
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
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    addPoiToGroup(poiArray: any = []): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": poiArray,
            "method": "poigroup_AddPOI",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }

    deletePoiToGroup(poiArray: any = []): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": poiArray,
            "method": "poigroup_DeletePOI",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }
}