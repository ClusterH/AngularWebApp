import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class VehMarkersService {
    onVehMarkerClickChanged: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
    ) {
        this.onVehMarkerClickChanged = new BehaviorSubject([]);
    }

    getVehMarkers(): Observable<any> {
        console.log('getvehiclelocationservice=======>>>');
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('method', "GetVehicleLocations");
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }
}