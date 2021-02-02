import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { isEmpty } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ClipsService {
    vehicleList: any;
    public selectedOption = new BehaviorSubject<any>({});
    public clip_mileageChanged = new BehaviorSubject<any>({});
    public clip_numberofvehiclesChanged = new BehaviorSubject<any>({});
    public clip_numberofusersChanged = new BehaviorSubject<any>({});
    public clip_stopcomplianceChanged = new BehaviorSubject<any>({});
    public clip_stopcomplianceSMChanged = new BehaviorSubject<any>({});
    public clip_mpgChanged = new BehaviorSubject<any>({});

    constructor(private _httpClient: HttpClient) { }

    dashboard_clip_delete(id: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', 'dashboard_clip_delete');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    clip_mileage(method: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                .set('method', method);
            if (!isEmpty(this.selectedOption.value)) {
                params.append('timeselection', this.selectedOption.value.timeselection);
                params.append('groupselection', this.selectedOption.value.groupselection);
            }

            this._httpClient.get('trackingxlapi.ashx', {
                headers: headers,
                params: params
            }).subscribe((res: any) => {

                switch (method) {
                    case 'clip_RouteCompliance':
                        this.clip_stopcomplianceChanged.next(res);
                        resolve(res);
                        break;
                    case 'clip_mileage':
                        this.clip_mileageChanged.next(res);
                        resolve(res);
                        break;
                    case 'clip_mpg':
                        this.clip_mpgChanged.next(res);
                        resolve(res);
                        break;
                    case 'clip_numberofvehicles':
                        this.clip_numberofvehiclesChanged.next(res);
                        resolve(res);
                        break;
                    case 'clip_numberofusers':
                        this.clip_numberofusersChanged.next(res);
                        resolve(res);
                        break;
                }
            }, reject);
        })
    }

    clip_mileageDetail(method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('method', method);
        if (!isEmpty(this.selectedOption.value)) {
            params.append('timeselection', this.selectedOption.value.timeselection);
            params.append('groupselection', this.selectedOption.value.groupselection);
        }
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    getVehicles(pageindex: number, pagesize: number, orderby: string, orderdirection: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('orderby', orderby.toString())
            .set('orderdirection', orderdirection.toString())
            .set('method', method.toString());
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}