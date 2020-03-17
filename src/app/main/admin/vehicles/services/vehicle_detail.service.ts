import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class VehicleDetailService 
{
    routeParams: any;
    vehicle: any;
    public vehicle_detail: any;

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
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        
        if(name == '') {
            let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('pageindex', (pageindex + 1).toString())
            .set('pagesize', pagesize.toString())
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
            .set('name', `^${name}^`) 
            .set('method', method.toString());
            
            console.log('params', params);

            return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            });
        }
        
    }

    saveVehicleDetail(conncode: string, userid: number, vehicleDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', vehicleDetail.id.toString())
            .set('name', vehicleDetail.name.toString())
            .set('companyid', vehicleDetail.companyid.toString())
            .set('groupid', vehicleDetail.groupid.toString())
            .set('subgroup', vehicleDetail.subgroup.toString())
            .set('operatorid', vehicleDetail.operatorid.toString())
            .set('accountid', vehicleDetail.accountid.toString())
            .set('unittypeid', vehicleDetail.unittypeid.toString())
            .set('serviceplanid', vehicleDetail.serviceplanid.toString())
            .set('producttypeid', vehicleDetail.producttypeid.toString())
            .set('makeid', vehicleDetail.makeid.toString())
            .set('modelid', vehicleDetail.modelid.toString())
            .set('isactive', vehicleDetail.isactive.toString())
            .set('timezoneid', vehicleDetail.timezoneid.toString())
            .set('created', vehicleDetail.created.toString())
            .set('createdby', vehicleDetail.createdby.toString())
            .set('deletedwhen', vehicleDetail.deletedwhen.toString())
            .set('deletedby', vehicleDetail.deletedby.toString())
            .set('lastmodifieddate', vehicleDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', vehicleDetail.lastmodifiedby.toString())
            .set('method', 'unit_save');

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
        
        // vehicleDetail["method"] = "unit_save";
        // vehicleDetail["conncode"] = "PolarixUSA";
        // vehicleDetail["userid"] = "2";
        // vehicleDetail["isactive"] = "true";

        // {
        //     conncode: conncode.toString(),
        //     userid: userid.toString(),
        //     id: vehicleDetail.id.toString(),
        //     name: vehicleDetail.name.toString(),
        //     companyid: vehicleDetail.companyid.toString(),
        //     'groupid': vehicleDetail.groupid.toString(),
        //     'subgroup': vehicleDetail.subgroup.toString(),
        //     'operatorid': vehicleDetail.operatorid.toString(),
        //     'accountid': vehicleDetail.accountid.toString(),
        //     'unittypeid': vehicleDetail.unittypeid.toString(),
        //     'serviceplanid': vehicleDetail.serviceplanid.toString(),
        //     'producttypeid': vehicleDetail.producttypeid.toString(),
        //     'makeid': vehicleDetail.makeid.toString(),
        //     'modelid': vehicleDetail.modelid.toString(),
        //     'isactive': vehicleDetail.isactive.toString(),
        //     'timezoneid': vehicleDetail.timezoneid.toString(),
        //     'created': vehicleDetail.created.toString(),
        //     'createdby': vehicleDetail.createdby.toString(),
        //     'deletedwhen': vehicleDetail.deletedwhen.toString(),
        //     'deletedby': vehicleDetail.deletedby.toString(),
        //     'lastmodifieddate': vehicleDetail.lastmodifieddate.toString(),
        //     'lastmodifiedby': vehicleDetail.lastmodifiedby.toString(),
        //     'method': 'unit_save'
        // }
        // let objects = JSON.stringify(params_detail);
        // console.log(objects);
        // alert(objects);

       
    }


    // getProduct(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //         if ( this.routeParams.id === 'new' )
    //         {
    //             console.log("new:", this.routeParams);
    //             this.onProductChanged.next(false);
    //             resolve(false);
    //         }
    //         else
    //         {
    //             console.log("edit:", this.routeParams);

    //             // this._httpClient.get('api/e-commerce-products/' + this.routeParams.id)
    //             //     .subscribe((response: any) => {
    //                     this.vehicle = {
    //                         id: "735",
    //                         name: "WAREHOUSE ISUZU-2013-LRG",
    //                         companyid: "85",
    //                         company: "MIA INSTALLATION",
    //                         groupid: "260",
    //                         group: "MIA INSTALLATION",
    //                         subgroup: "0",
    //                         accountid: "85",
    //                         account: "MIA INSTALLATION",
    //                         operatorid: "0",
    //                         operator: "",
    //                         unittypeid: "10",
    //                         unittype: "TRUCK",
    //                         serviceplanid: "5",
    //                         serviceplan: "Asset Rentals",
    //                         producttypeid: "1",
    //                         producttype: "Vehicle",
    //                         makeid: "28",
    //                         make: "ISUZU",
    //                         modelid: "363",
    //                         model: "CARIBE",
    //                         isactive: "true",
    //                         timezoneid: "13",
    //                         timezone: "(GMT-05:00) Eastern Time (US & Canada)",
    //                         created: "2014-04-03T18:40:17.473-04:00",
    //                         createdby: "0",
    //                         createdbyname: "",
    //                         deletedwhen: "2018-05-04T09:24:43.58-04:00",
    //                         deletedby: "2",
    //                         deletedbyname: "Admins Polarix",
    //                         lastmodifieddate: "2020-01-13T18:08:03.777-05:00",
    //                         lastmodifiedby: "260",
    //                         lastmodifiedbyname: "Carlos Uranga"
    //                     };
    //                     this.onProductChanged.next(this.vehicle);
    //                     resolve(this.vehicle);
    //                     console.log(this.vehicle);
    //                 // }, reject);
    //         }
    //     });
    // }

   
   
   
}
