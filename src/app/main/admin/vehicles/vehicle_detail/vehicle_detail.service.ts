import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class VehicleDetailService implements Resolve<any>
{
    routeParams: any;
    vehicle: any;
    onVehicleChanged: BehaviorSubject<any>;

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
        this.onVehicleChanged = new BehaviorSubject({});
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
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getVehicle()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get vehicle
     *
     * @returns {Promise<any>}
     */
    getVehicle(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            console.log(this.routeParams);
            if ( !this.routeParams )
            {
                this.onVehicleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get('api/admin-vehicles/' + this.routeParams)
                    .subscribe((response: any) => {
                        this.vehicle = response;
                        this.onVehicleChanged.next(this.vehicle);
                        resolve(this.routeParams);
                    }, reject);
            }
        });
    }

    /**
     * Save vehicle
     *
     * @param vehicle
     * @returns {Promise<any>}
     */
    saveVehicle(vehicle): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/admin-vehicles/' + vehicle.id, vehicle)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add vehicle
     *
     * @param vehicle
     * @returns {Promise<any>}
     */
    addVehicle(vehicle): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/admin-vehicles/', vehicle)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
