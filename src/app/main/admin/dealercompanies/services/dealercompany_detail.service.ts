import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DealerCompanyDetailService 
{
    routeParams: any;
    dealercompany: any;
    public dealercompany_detail: any;
    public dealercompany_clist_item: any = {};

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

    getDealerCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string): Observable<any>
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

    saveDealerCompanyDetail(conncode: string, userid: number, dealercompanyDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', dealercompanyDetail.id.toString())
            .set('name', dealercompanyDetail.name.toString())
            .set('orgno', dealercompanyDetail.orgno.toString())
            .set('accountid', dealercompanyDetail.accountid.toString())
            .set('companytypeid', dealercompanyDetail.companytypeid.toString())
            .set('userprofileid', dealercompanyDetail.userprofileid.toString())          
            .set('isactive', dealercompanyDetail.isactive.toString())
            .set('created', dealercompanyDetail.created.toString())
            .set('createdby', dealercompanyDetail.createdby.toString())
            .set('deletedwhen', dealercompanyDetail.deletedwhen.toString())
            .set('deletedby', dealercompanyDetail.deletedby.toString())
            .set('lastmodifieddate', dealercompanyDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', dealercompanyDetail.lastmodifiedby.toString())
            .set('emailserver', dealercompanyDetail.emailserver.toString())
            .set('emailsender', dealercompanyDetail.emailsender.toString())
            .set('emailuser', dealercompanyDetail.emailuser.toString())
            .set('emailpassword', dealercompanyDetail.emailpassword.toString())            
            .set('logofile', dealercompanyDetail.logofile.toString())
            .set('address', dealercompanyDetail.address.toString())
            .set('country', dealercompanyDetail.country.toString())
            .set('contactname', dealercompanyDetail.contactname.toString())
            .set('phone', dealercompanyDetail.phone.toString())
            .set('email', dealercompanyDetail.email.toString())
            .set('comments', dealercompanyDetail.comments.toString())
            .set('billingnote', dealercompanyDetail.billingnote.toString())
            .set('webstartlat', dealercompanyDetail.webstartlat.toString())
            .set('webstartlong', dealercompanyDetail.webstartlong.toString())
            .set('hasprivatelabel', dealercompanyDetail.hasprivatelabel.toString())
            .set('method', 'company_save');
        
            console.log(params_detail);

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
        
        // dealercompanyDetail["method"] = "unit_save";
        // dealercompanyDetail["conncode"] = "PolarixUSA";
        // dealercompanyDetail["userid"] = "2";
        // dealercompanyDetail["isactive"] = "true";

        // {
        //     conncode: conncode.toString(),
        //     userid: userid.toString(),
        //     id: dealercompanyDetail.id.toString(),
        //     name: dealercompanyDetail.name.toString(),
        //     dealercompanyid: dealercompanyDetail.dealercompanyid.toString(),
        //     'groupid': dealercompanyDetail.groupid.toString(),
        //     'subgroup': dealercompanyDetail.subgroup.toString(),
        //     'operatorid': dealercompanyDetail.operatorid.toString(),
        //     'accountid': dealercompanyDetail.accountid.toString(),
        //     'unittypeid': dealercompanyDetail.unittypeid.toString(),
        //     'serviceplanid': dealercompanyDetail.serviceplanid.toString(),
        //     'producttypeid': dealercompanyDetail.producttypeid.toString(),
        //     'makeid': dealercompanyDetail.makeid.toString(),
        //     'modelid': dealercompanyDetail.modelid.toString(),
        //     'isactive': dealercompanyDetail.isactive.toString(),
        //     'timezoneid': dealercompanyDetail.timezoneid.toString(),
        //     'created': dealercompanyDetail.created.toString(),
        //     'createdby': dealercompanyDetail.createdby.toString(),
        //     'deletedwhen': dealercompanyDetail.deletedwhen.toString(),
        //     'deletedby': dealercompanyDetail.deletedby.toString(),
        //     'lastmodifieddate': dealercompanyDetail.lastmodifieddate.toString(),
        //     'lastmodifiedby': dealercompanyDetail.lastmodifiedby.toString(),
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
    //                     this.dealercompany = {
    //                         id: "735",
    //                         name: "WAREHOUSE ISUZU-2013-LRG",
    //                         dealercompanyid: "85",
    //                         dealercompany: "MIA INSTALLATION",
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
    //                         producttype: "DealerCompany",
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
    //                     this.onProductChanged.next(this.dealercompany);
    //                     resolve(this.dealercompany);
    //                     console.log(this.dealercompany);
    //                 // }, reject);
    //         }
    //     });
    // }

   
   
   
}
