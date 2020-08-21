import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class UnitInfoService {
    // onUnitChanged: any = '';


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // this.onUnitChanged = new BehaviorSubject({});
    }

    getUnitInfo(conncode: string, userid: number, unitid: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', unitid.toString())
            .set('method', 'GetUnitInfo_v1');
        console.log(params);

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    sendShareLocation(conncode: string, userid: number, unitid: number, validitytime: number, emailaddress: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('unitid', unitid.toString())
            .set('validitytime', validitytime.toString())
            .set('emailaddress', emailaddress.toString())
            .set('method', 'ShareLocation');
        console.log(params);

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    locateNow(conncode: string, userid: number, unitid: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('unitid', unitid.toString())
            .set('method', 'LocateUnit');
        console.log(params);

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    getPOIList(conncode: string, userid: number, unitid: number, pageindex: number, pagesize: number, filterstring: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('conncode', conncode)
            .set('userid', userid.toString())
            .set('unitid', unitid.toString())
            .set('pageindex', pageindex.toString())
            .set('pagesize', pagesize.toString())
            .set('method', 'GetUnitPOIs');
        console.log(params);

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}
