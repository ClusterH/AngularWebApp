import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class EventDetailService {
    routeParams: any;
    event: any;
    public event_detail: any;
    public unit_clist_item: any = {};
    public current_eventID: number;
    public eventConditionList: any = [];

    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
    }

    getPoiZone(pageindex: number, pagesize: number, name: string, companyid: number, groupid: number, method: string): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('groupid', groupid.toString())
                .set('method', `${method}`);
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('groupid', groupid.toString())
                .set('method', `${method}`);
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
    }

    getDigitalInput(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let substr1 = method.substring(0, 12);
        let substr2 = method.substring(13, method.length);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', `${substr1 + substr2}`);
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', `${substr1 + substr2}`);
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
    }

    getUnits(pageindex: number, pagesize: number, companyid: string, groupid: string, eventid: string): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('companyid', companyid.toString())
            .set('groupid', groupid.toString())
            .set('eventid', eventid.toString())
            .set('method', 'Unit_CList');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    getEvCondition(eventid: string): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', eventid.toString())
            .set('method', 'GetEventCondition_TList');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    saveEvCondition(param: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params_detail = new HttpParams;
        params_detail = param;

        return this._httpClient.get('trackingxlapi.ashx?', {
            headers: header_detail,
            params: params_detail
        });
    }

    saveEventDetail(eventDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params_detail = new HttpParams;
        params_detail = eventDetail;

        return this._httpClient.get('trackingxlapi.ashx?', {
            headers: header_detail,
            params: params_detail
        });
    }
}
