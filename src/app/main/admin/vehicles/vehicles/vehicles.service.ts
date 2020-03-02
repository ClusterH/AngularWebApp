import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class VehiclesService implements Resolve<any>
{
    vehicles: any[];
    onVehiclesChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    )
    {
        // Set the defaults
        this.onVehiclesChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getVehicles()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get vehicles
     *
     * @returns {Promise<any>}
     */
    getVehicles(): Promise<any>
    {
        // const obj = {
        //     conncode: "PolarixUSA",
        //     userid: "1",
        //     method: "Units_Tlist"
        // }

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        // headers.append('Access-Control-Allow-Headers', 'Content-Type');
        // headers.append('Access-Control-Allow-Origin', '*');
        // headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        console.log(headers);
            
        return new Promise((resolve, reject) => {
            this._httpClient.get('http://trackingxl.polarix.com/trackingxlapi.ashx?{conncode:"PolarixUSA",userid:"1",pageindex:"1",pagesize:"50",orderby:"true",orderdirection:"asc",method:"Units_TList"}', {headers: headers})
                .subscribe((response: any) => {
                    console.log(response);
                    this.vehicles = response.TrackingXLAPI.DATA;
                    console.log(this.vehicles);
                    this.onVehiclesChanged.next(this.vehicles);
                    resolve(response);
                }, reject);
        });
    }
    
    /**
     * Delete contact
     *
     * @param contact
     */
    deleteVehicle(vehicle): void
    {
        const vehicleIndex = this.vehicles.indexOf(vehicle);
        this.vehicles.splice(vehicleIndex, 1);
        this.onVehiclesChanged.next(this.vehicles);
    }

    duplicateVehicle(vehicle): void
    {
        const vehicleIndex = this.vehicles.indexOf(vehicle);
        this.vehicles.splice(vehicleIndex, 0, vehicle);
        this.onVehiclesChanged.next(this.vehicles);
    }
}
