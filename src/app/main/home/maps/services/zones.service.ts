import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ZoneRouteModel } from '../models';

@Injectable()
export class ZonesService {
    public zones = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public zones$: Observable<Array<ZoneRouteModel[]>> = this.zones.asObservable();
    public filterZones = new BehaviorSubject<Array<ZoneRouteModel[]>>([]);
    public filterZones$: Observable<Array<ZoneRouteModel[]>> = this.filterZones.asObservable();
    //Create Zone Secion
    public currentCompanyClist: any = [];
    public zonePointsList = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }

    getZones(): Observable<any> {
        const params = new HttpParams()
            .set('method', "GetZonesForMap");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    updateZones(zones: any) {
        this.zones.next(zones);
    }

    updateFilterZones(zones: any) {
        this.filterZones.next(zones);
    }

    getCompany(pageindex: number, pagesize: number, filterString: string): Observable<any> {
        if (filterString === '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', 'company_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${filterString}^`)
                .set('method', 'company_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params_detail
            });
        }
    }

    saveZoneDetail(zoneDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', zoneDetail.id.toString())
            .set('name', zoneDetail.name.toString())
            .set('companyid', zoneDetail.companyid.toString())
            .set('isactive', zoneDetail.isactive.toString())
            .set('created', zoneDetail.created.toString())
            .set('createdby', zoneDetail.createdby.toString())
            .set('lastmodifieddate', zoneDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', zoneDetail.lastmodifiedby.toString())
            .set('method', 'zone_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    setZonePath(pathArray: any = []): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "array": pathArray,
            "method": "Set_Zone_Path",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }

}