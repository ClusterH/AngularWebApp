import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class JobsService {
    jobs: any[];
    public unit_clist_item: any = {};
    public jobList: any = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getJobs(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
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

    getDetailClist(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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

    saveJob(jobDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', jobDetail.id.toString())
            .set('imei', jobDetail.imei.toString())
            .set('vin', jobDetail.vin.toString())
            .set('plate', jobDetail.plate.toString())
            .set('customername', jobDetail.customername.toString())
            .set('address', jobDetail.address.toString())
            .set('customerphonenumber', jobDetail.customerphonenumber.toString())
            .set('scheduledate', jobDetail.scheduledate.toString())
            .set('duration', jobDetail.duration.toString())
            .set('installerid', jobDetail.installerid.toString())
            .set('installcontractorid', jobDetail.installcontractorid.toString())
            .set('startdate', jobDetail.startdate.toString())
            .set('enddate', jobDetail.enddate.toString())
            .set('createdby', jobDetail.createdby.toString())
            .set('created', jobDetail.created.toString())
            .set('isactive', jobDetail.isactive.toString())
            .set('deletedby', jobDetail.deletedby.toString())
            .set('deletedwhen', jobDetail.deletedwhen.toString())
            .set('longitude', jobDetail.longitude.toString())
            .set('latitude', jobDetail.latitude.toString())
            .set('status', jobDetail.status.toString())
            .set('installationjobtypeid', jobDetail.installationjobtypeid.toString())
            .set('description', jobDetail.description.toString())
            .set('devicetypeid', jobDetail.devicetypeid.toString())
            .set('notes', jobDetail.notes.toString())
            .set('method', 'installation_Save');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    deleteJob(id: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', "installation_Delete");
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    Installationimages_TList(id: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('installationid', id.toString())
            .set('method', "Installationimages_TList");
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    saveInstallationImages(id: any, images: any): Observable<any> {

        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const header_detail = new HttpHeaders()
            .append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"))
        const body = {
            "installationid": id,
            "data": images,
            "method": "InstallationImages_Save",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }

        return this._httpClient.post('http://trackingxlapi.polarix.com/trackingxlapi.ashx', body, {
            headers: header_detail,
        });
    }

    deleteInstallationImages(id: any, images: any): Observable<any> {

        let token: string = localStorage.getItem('current_token') || '';
        let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const body = {
            "installationid": id,
            "data": images,
            "method": "InstallationImages_Delete",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('http://trackingxlapi.polarix.com/trackingxlapi.ashx', body, {
            headers: headers,
        });
    }
}