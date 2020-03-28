import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class UnittypesService
{
    unittypes: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }
    
    getUnittypes(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any>
    {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (filterItem == '') {
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
               
            console.log('params', params);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());

            console.log('params', params);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        }
    }
    
    /**
     * Delete contact
     *
    //  * @param contact
     */
    // deleteUnittype(unittype): void
    // {
    //     const unittypeIndex = this.unittypes.indexOf(unittype);
    //     this.unittypes.splice(unittypeIndex, 1);
    //     this.onUnittypesChanged.next(this.unittypes);
    // }

    // duplicateUnittype(unittype): void
    // {
    //     const unittypeIndex = this.unittypes.indexOf(unittype);
    //     this.unittypes.splice(unittypeIndex, 0, unittype);
    //     this.onUnittypesChanged.next(this.unittypes);
    // }
}
