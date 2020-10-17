import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class MaintservicesService {
    maintservices: any[];
    public unit_clist_item: any = {};
    public maintserviceList: any = [];
    public current_serviceID: string = '';
    public new_serviceID: string = '';
    pageType: string = '';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getMaintservices(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (filterItem == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
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

    getItemDetail(pageindex: number, pagesize: number, serviceid: string, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let paramIdentity = (this.pageType == 'edit' || this.new_serviceID != '') ? 'serviceid' : 'companyid';
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set(`${paramIdentity}`, serviceid.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set(`${paramIdentity}`, serviceid.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    saveMaintservice(maintserviceDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', maintserviceDetail.id.toString())
            .set('name', maintserviceDetail.name.toString())
            .set('companyid', maintserviceDetail.companyid.toString())
            .set('groupid', maintserviceDetail.groupid.toString())
            .set('isactive', maintserviceDetail.isactive.toString())
            .set('method', 'maintservice_save');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }



    addMaintServiceToGroup(maintserviceArray: any = []): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": maintserviceArray,
            "method": "MaintService_AddMaintServiceItem",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('http://trackingxlapi.polarix.com/trackingxlapi.ashx', body, {
            headers: header_detail,
        });
    }

    deleteMaintServiceToGroup(maintserviceArray: any = []): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "data": maintserviceArray,
            "method": "MaintService_DeleteMaintServiceItem",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('http://trackingxlapi.polarix.com/trackingxlapi.ashx', body, {
            headers: header_detail,
        });
    }

    deleteMaintservice(id: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', "maintservice_delete");
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}