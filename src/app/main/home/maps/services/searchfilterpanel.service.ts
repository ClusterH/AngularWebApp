import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class FilterPanelService {
    params: HttpParams;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }
    public vehmarkerSubject = new BehaviorSubject<any>([]);
    public userPOISubject = new BehaviorSubject<any>([]);
    public vehmarkers_temp$: Observable<any> = this.vehmarkerSubject.asObservable();
    public userPOI_temp$: Observable<any> = this.userPOISubject.asObservable();
    public loadingsubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingsubject.asObservable();

    loadVehMarkers(vehimarkers: any) {
        this.vehmarkerSubject.next(vehimarkers);
    }

    loadUserPOIs(pois: any) {
        this.userPOISubject.next(pois);
    }

    getFilterPanelClists(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            this.params = new HttpParams()
                .set('pageindex', pageindex.toString())
                .set('pagesize', pagesize.toString())
                .set('method', method);
        } else {
            this.params = new HttpParams()
                .set('pageindex', pageindex.toString())
                .set('pagesize', pagesize.toString())
                .set('name', name.toString())
                .set('method', method);
        }
        return this._httpClient.get('trackingxlapi.ashx', {
            params: this.params
        });
    }
}