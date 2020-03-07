import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class VehiclesService
{
    vehicles: any[];
    vehicle_detail: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) { }
    
    getVehicles(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any>
    {
        // const obj = {
        //     conncode: "PolarixUSA",
        //     userid: "1",
        //     method: "Units_Tlist"
        // }

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

            return  this._httpClient.get('http://trackingxl.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        } else {
            // filterString = "%" + filterString + "%";
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `%${filterString}%`.toString())
                .set('method', method.toString());

            console.log('params', params);

            return  this._httpClient.get('http://trackingxl.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        }
        

   
        // console.log(headers);
        // console.log(conncode, pageindex, pagesize, userid, orderby, orderdirection, method);
            
        // return  this._httpClient.get('http://trackingxl.polarix.com/trackingxlapi.ashx?{conncode:"PolarixUSA",userid:"1",pageindex:"1",pagesize:"5",orderby:"Name",orderdirection:"ASC",method:"Unit_TList"}', {headers: headers})
        // return  this._httpClient.get('http://trackingxl.polarix.com/trackingxlapi.ashx',{
        //         headers: headers,   
        //         params: params
        //     });
    }
    
    /**
     * Delete contact
     *
    //  * @param contact
     */
    // deleteVehicle(vehicle): void
    // {
    //     const vehicleIndex = this.vehicles.indexOf(vehicle);
    //     this.vehicles.splice(vehicleIndex, 1);
    //     this.onVehiclesChanged.next(this.vehicles);
    // }

    // duplicateVehicle(vehicle): void
    // {
    //     const vehicleIndex = this.vehicles.indexOf(vehicle);
    //     this.vehicles.splice(vehicleIndex, 0, vehicle);
    //     this.onVehiclesChanged.next(this.vehicles);
    // }
}
