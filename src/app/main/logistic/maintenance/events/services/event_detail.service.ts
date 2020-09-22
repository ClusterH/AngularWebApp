import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { group } from '@angular/animations';

@Injectable()
export class EventDetailService {
    routeParams: any;
    event: any;
    public event_detail: any;
    public unit_clist_item: any = {};
    public current_eventID: string = '';
    public eventConditionList: any = [];
    public new_eventID: string = '';

    pageType: string = '';

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
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        if (name == '') {

            let params = new HttpParams()

                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());

            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });

        } else {
            let params = new HttpParams()

                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());

            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
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

            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
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

            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }

    }

    getUnits(pageindex: number, pagesize: number, companyid: string, groupid: string, eventid: string): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        if (groupid == 'none' || groupid == undefined) {
            groupid = '';
        }

        const params_detail = new HttpParams()

            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('companyid', companyid.toString())
            .set('groupid', groupid.toString())
            .set('eventid', this.current_eventID.toString())
            .set('method', 'Unit_CList');

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    getEventUnits(pageindex: number, pagesize: number, eventid: string, groupid: string, name: string, method: string): Observable<any> {

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        let paramIdentity = (this.pageType == 'edit' || this.new_eventID != '') ? 'mainteventid' : 'companyid';
        if (name == '') {
            if (paramIdentity == 'companyid') {
                let params = new HttpParams()

                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('groupid', groupid.toString())
                    .set(`${paramIdentity}`, eventid.toString())
                    .set('method', method.toString());



                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()

                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set(`${paramIdentity}`, eventid.toString())
                    .set('method', method.toString());



                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }

        } else {
            if (paramIdentity == 'companyid') {
                let params = new HttpParams()

                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('groupid', groupid.toString())
                    .set(`${paramIdentity}`, eventid.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());



                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()

                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set(`${paramIdentity}`, eventid.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());



                return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        }
    }

    saveEventDetail(eventDetail: any = {}): Observable<any> {

        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(eventDetail), {
            headers: header_detail,
        });
    }

    addMaintServiceToGroup(maintserviceArray: any = []): Observable<any> {

        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_data = {
            'data': maintserviceArray,
            'method': 'MaintEvent_AddUnit'
        }

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(params_data), {
            headers: header_detail
        });
    }

    deleteMaintServiceToGroup(maintserviceArray: any = []): Observable<any> {

        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_data = {
            'data': maintserviceArray,
            'method': 'MaintEvent_DeleteUnit'
        }

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(params_data), {
            headers: header_detail
        });
    }
}
