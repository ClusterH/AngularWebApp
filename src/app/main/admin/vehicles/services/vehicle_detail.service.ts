import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class VehicleDetailService 
{
    routeParams: any;
    vehicle: any;
    onProductChanged: BehaviorSubject<any>;

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
        this.onProductChanged = new BehaviorSubject({});
    }

    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    // {
    //     this.routeParams = route.params;

    //     return new Promise((resolve, reject) => {

    //         Promise.all([
    //             this.getProduct()
    //         ]).then(
    //             () => {
    //                 resolve();
    //             },
    //             reject
    //         );
    //     });
    // }

    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getProduct(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                console.log("new:", this.routeParams);
                this.onProductChanged.next(false);
                resolve(false);
            }
            else
            {
                console.log("edit:", this.routeParams);

                // this._httpClient.get('api/e-commerce-products/' + this.routeParams.id)
                //     .subscribe((response: any) => {
                        this.vehicle = {
                            id: "735",
                            name: "WAREHOUSE ISUZU-2013-LRG",
                            companyid: "85",
                            company: "MIA INSTALLATION",
                            groupid: "260",
                            group: "MIA INSTALLATION",
                            subgroup: "0",
                            accountid: "85",
                            account: "MIA INSTALLATION",
                            operatorid: "0",
                            operator: "",
                            unittypeid: "10",
                            unittype: "TRUCK",
                            serviceplanid: "5",
                            serviceplan: "Asset Rentals",
                            producttypeid: "1",
                            producttype: "Vehicle",
                            makeid: "28",
                            make: "ISUZU",
                            modelid: "363",
                            model: "CARIBE",
                            isactive: "true",
                            timezoneid: "13",
                            timezone: "(GMT-05:00) Eastern Time (US & Canada)",
                            created: "2014-04-03T18:40:17.473-04:00",
                            createdby: "0",
                            createdbyname: "",
                            deletedwhen: "2018-05-04T09:24:43.58-04:00",
                            deletedby: "2",
                            deletedbyname: "Admins Polarix",
                            lastmodifieddate: "2020-01-13T18:08:03.777-05:00",
                            lastmodifiedby: "260",
                            lastmodifiedbyname: "Carlos Uranga"
                        };
                        this.onProductChanged.next(this.vehicle);
                        resolve(this.vehicle);
                        console.log(this.vehicle);
                    // }, reject);
            }
        });
    }

    /**
     * Save product
     *
     * @param product
     * @returns {Promise<any>}
     */
    saveProduct(product): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-products/' + product.id, product)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add product
     *
     * @param product
     * @returns {Promise<any>}
     */
    addProduct(product): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-products/', product)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
