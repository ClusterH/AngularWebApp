import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    getFilterPanelClists(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            this.params = new HttpParams()

                .set('pageindex', pageindex.toString())
                .set('pagesize', pagesize.toString())
                .set('method', method);
            console.log(this.params);
        } else {
            this.params = new HttpParams()

                .set('pageindex', pageindex.toString())
                .set('pagesize', pagesize.toString())
                .set('name', name.toString())
                .set('method', method);
            console.log(this.params);
        }

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: this.params
        });
    }
}
