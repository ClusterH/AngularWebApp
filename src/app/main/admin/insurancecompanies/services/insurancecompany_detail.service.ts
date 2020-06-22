import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class InsuranceCompanyDetailService 
{
    routeParams: any;
    insurancecompany: any;
    public insurancecompany_detail: any;
    public insurancecompany_clist_item: any = {};

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

    getInsuranceCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string): Observable<any>
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

    saveInsuranceCompanyDetail(conncode: string, userid: number, insurancecompanyDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        const params_detail = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', insurancecompanyDetail.id.toString())
            .set('name', insurancecompanyDetail.name.toString())
            .set('orgno', insurancecompanyDetail.orgno.toString())
            .set('accountid', insurancecompanyDetail.accountid.toString())
            .set('companytypeid', insurancecompanyDetail.companytypeid.toString())
            .set('userprofileid', insurancecompanyDetail.userprofileid.toString())          
            .set('isactive', insurancecompanyDetail.isactive.toString())
            .set('created', insurancecompanyDetail.created.toString())
            .set('createdby', insurancecompanyDetail.createdby.toString())
            .set('deletedwhen', insurancecompanyDetail.deletedwhen.toString())
            .set('deletedby', insurancecompanyDetail.deletedby.toString())
            .set('lastmodifieddate', insurancecompanyDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', insurancecompanyDetail.lastmodifiedby.toString())
            .set('emailserver', insurancecompanyDetail.emailserver.toString())
            .set('emailsender', insurancecompanyDetail.emailsender.toString())
            .set('emailuser', insurancecompanyDetail.emailuser.toString())
            .set('emailpassword', insurancecompanyDetail.emailpassword.toString())            
            .set('logofile', insurancecompanyDetail.logofile.toString())
            .set('address', insurancecompanyDetail.address.toString())
            .set('country', insurancecompanyDetail.country.toString())
            .set('contactname', insurancecompanyDetail.contactname.toString())
            .set('phone', insurancecompanyDetail.phone.toString())
            .set('email', insurancecompanyDetail.email.toString())
            .set('comments', insurancecompanyDetail.comments.toString())
            .set('billingnote', insurancecompanyDetail.billingnote.toString())
            .set('webstartlat', insurancecompanyDetail.webstartlat.toString())
            .set('webstartlong', insurancecompanyDetail.webstartlong.toString())
            .set('hasprivatelabel', insurancecompanyDetail.hasprivatelabel.toString())
            .set('method', 'company_save');
        
            

        return  this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
               
    }


    // getProduct(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //         if ( this.routeParams.id === 'new' )
    //         {
    //             
    //             this.onProductChanged.next(false);
    //             resolve(false);
    //         }
    //         else
    //         {
    //             

    //             // this._httpClient.get('api/e-commerce-products/' + this.routeParams.id)
    //             //     .subscribe((response: any) => {
    //                     this.insurancecompany = {
    //                         id: "735",
    //                         name: "WAREHOUSE ISUZU-2013-LRG",
    //                         insurancecompanyid: "85",
    //                         insurancecompany: "MIA INSTALLATION",
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
    //                         producttype: "InsuranceCompany",
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
    //                     this.onProductChanged.next(this.insurancecompany);
    //                     resolve(this.insurancecompany);
    //                     
    //                 // }, reject);
    //         }
    //     });
    // }

   
   
   
}
