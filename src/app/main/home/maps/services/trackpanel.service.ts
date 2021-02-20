import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class TrackPanelService {
    params: HttpParams;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getTrackPanelClists(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
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