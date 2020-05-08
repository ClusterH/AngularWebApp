import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { group } from '@angular/animations';

@Injectable()
export class EventDetailService 
{
    routeParams: any;
    event: any;
    public event_detail: any;
    public unit_clist_item: any = {};
    public current_eventID: number;
    public eventConditionList: any = [];


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
    }

    getCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string): Observable<any>
    {
        console.log("SERVICE-getCompanies() :", method);
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            
            let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('method', method.toString());

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
            .set('name', `^${name}^`) 
            .set('method', method.toString());

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        }
    }

    getGroups(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        console.log(pageindex, pagesize,  companyid);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('companyid', companyid.toString())
            .set('method', 'group_CList');
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('name', `^${name}^`) 
            .set('companyid', companyid.toString())
            .set('method', 'group_CList');
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
        
    }

    getPoiZone(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, companyid: number, groupid: number, method: string): Observable<any> {
        console.log(pageindex, pagesize,  companyid, name, groupid, method);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('companyid', companyid.toString())
            .set('groupid', groupid.toString())
            .set('method', `${method}`);
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('name', `^${name}^`) 
            .set('companyid', companyid.toString())
            .set('groupid', groupid.toString())
            .set('method', `${method}`);
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
        
    }

    getDigitalInput(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        console.log(pageindex, pagesize, name, method);
        let substr1 = method.substring(0, 12);
        let substr2 = method.substring(13, method.length);
        console.log(substr1 + substr2);

        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('method', `${substr1 + substr2}`);
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('name', `^${name}^`) 
            .set('method', `${substr1 + substr2}`);
        
            console.log(params_detail);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
        
    }

    getUnits(conncode: string, userid: number, pageindex: number, pagesize: number, companyid: string, groupid: string, eventid: string): Observable<any> {
        console.log(pageindex, pagesize, companyid, groupid, eventid);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
            .set('companyid', companyid.toString())
            .set('groupid', groupid.toString())
            .set('eventid', eventid.toString())
            .set('method', 'Unit_CList');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    getEvCondition(conncode: string, userid: number, eventid: string): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', eventid.toString())
            .set('method', 'GetEventCondition_TList');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }

    saveEvCondition(param: any = {}): Observable<any> {
        console.log(param);
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(param), {
            headers: header_detail,
        });
    }

    saveEventDetail(eventDetail: any = {}): Observable<any> {
        console.log(eventDetail);
        
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        // const params_detail = new HttpParams()
        //     .set('conncode', conncode.toString())
        //     .set('userid', userid.toString())
        //     .set('id', eventDetail.id.toString())
        //     .set('name', eventDetail.name.toString())
        //     .set('method', 'event_save');
        
        //     console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx?' + JSON.stringify(eventDetail), {
            headers: header_detail,
        });
    }
}
