import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class RoutePlanningJobService {
    public loadingsubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingsubject.asObservable();

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getRoutePlanningJob(pageindex: number, pagesize: number, orderby: string, orderdirection: string, seldate: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('pageindex', (pageindex).toString())
            .set('pagesize', pagesize.toString())
            .set('orderby', orderby.toString())
            .set('orderdirection', orderdirection.toString())
            .set('seldate', seldate.toString())
            .set('method', method.toString());
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    deleteJob(id: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', "routeplanningjobs_delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    saveJob(jobdetail): Observable<any> {

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', jobdetail.id.toString())
            .set('stopname', jobdetail.stopname.toString())
            .set('schedtime', jobdetail.schedtime.toString())
            .set('latitude', jobdetail.latitude.toString())
            .set('longitude', jobdetail.longitude.toString())
            .set('jsondata', jobdetail.jsondata.toString())
            .set('pointid', jobdetail.pointid.toString())
            .set('pointradio', jobdetail.pointradio.toString())
            .set('earlytolerancemin', jobdetail.earlytolerancemin.toString())
            .set('latetolerancemin', jobdetail.latetolerancemin.toString())
            .set('address', jobdetail.address.toString())
            .set('description', jobdetail.description.toString())
            .set('method', "routeplanningjobs_Save");
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    setJobInclude(id: number, include: number, seldate: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('include', include.toString())
            .set('seldate', seldate.toString())
            .set('method', "routeplanningjobs_SetInclude");
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}