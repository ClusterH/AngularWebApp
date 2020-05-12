import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class PendingsService
{
    pendings: any[];
    public maintPendingList: any = [];


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }
    
    getPendings(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any>
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
    
    deletePending(id: number): Observable<any>
    {
        let userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        let userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
                .set('conncode', userConncode.toString())
                .set('userid', userID.toString())
                .set('id', id.toString())
                .set('method', "pending_delete");
               
            console.log('params', params);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
            headers: headers,   
            params: params
        });
    }

    getDashboard(userConncode: string, userID: number): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        let params = new HttpParams()
                .set('conncode', userConncode.toString())
                .set('userid', userID.toString())
                .set('method', "maintenance_dashboard");
               
            console.log('params', params);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
            headers: headers,   
            params: params
        });
    }

    saveAttend(userConncode, userID, attend: any): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        let params = new HttpParams()
                .set('conncode', userConncode.toString())
                .set('userid', userID.toString())
                .set('id', attend.id.toString())
                .set('action', attend.action.toString())
                .set('cost', attend.cost.toString())
                .set('performdate', attend.performdate.toString())
                .set('method', "maintevent_attend");
               
            console.log('params', params);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
            headers: headers,   
            params: params
        });
    }
}
