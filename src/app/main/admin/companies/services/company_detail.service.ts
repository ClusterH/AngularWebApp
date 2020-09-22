import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyDetailService {
    routeParams: any;
    company: any;
    public company_detail: any;
    public company_clist_item: any = {};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        } else {
            let params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('method', method.toString());
            return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,
                params: params
            });
        }
    }

    saveCompanyDetail(companyDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', companyDetail.id.toString())
            .set('name', companyDetail.name.toString())
            .set('orgno', companyDetail.orgno.toString())
            .set('accountid', companyDetail.accountid.toString())
            .set('companytypeid', companyDetail.companytypeid.toString())
            .set('userprofileid', companyDetail.userprofileid.toString())
            .set('isactive', companyDetail.isactive.toString())
            .set('created', companyDetail.created.toString())
            .set('createdby', companyDetail.createdby.toString())
            .set('deletedwhen', companyDetail.deletedwhen.toString())
            .set('deletedby', companyDetail.deletedby.toString())
            .set('lastmodifieddate', companyDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', companyDetail.lastmodifiedby.toString())
            .set('emailserver', companyDetail.emailserver.toString())
            .set('emailsender', companyDetail.emailsender.toString())
            .set('emailuser', companyDetail.emailuser.toString())
            .set('emailpassword', companyDetail.emailpassword.toString())
            .set('logofile', companyDetail.logofile.toString())
            .set('address', companyDetail.address.toString())
            .set('country', companyDetail.country.toString())
            .set('contactname', companyDetail.contactname.toString())
            .set('phone', companyDetail.phone.toString())
            .set('email', companyDetail.email.toString())
            .set('comments', companyDetail.comments.toString())
            .set('billingnote', companyDetail.billingnote.toString())
            .set('webstartlat', companyDetail.webstartlat.toString())
            .set('webstartlong', companyDetail.webstartlong.toString())
            .set('hasprivatelabel', companyDetail.hasprivatelabel.toString())
            .set('method', 'company_save');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });

        // companyDetail["method"] = "unit_save";
        // companyDetail["conncode"] = "PolarixUSA";
        // companyDetail["userid"] = "2";
        // companyDetail["isactive"] = "true";

        // {
        //     conncode: conncode.toString(),
        //     userid: userid.toString(),
        //     id: companyDetail.id.toString(),
        //     name: companyDetail.name.toString(),
        //     companyid: companyDetail.companyid.toString(),
        //     'groupid': companyDetail.groupid.toString(),
        //     'subgroup': companyDetail.subgroup.toString(),
        //     'operatorid': companyDetail.operatorid.toString(),
        //     'accountid': companyDetail.accountid.toString(),
        //     'unittypeid': companyDetail.unittypeid.toString(),
        //     'serviceplanid': companyDetail.serviceplanid.toString(),
        //     'producttypeid': companyDetail.producttypeid.toString(),
        //     'makeid': companyDetail.makeid.toString(),
        //     'modelid': companyDetail.modelid.toString(),
        //     'isactive': companyDetail.isactive.toString(),
        //     'timezoneid': companyDetail.timezoneid.toString(),
        //     'created': companyDetail.created.toString(),
        //     'createdby': companyDetail.createdby.toString(),
        //     'deletedwhen': companyDetail.deletedwhen.toString(),
        //     'deletedby': companyDetail.deletedby.toString(),
        //     'lastmodifieddate': companyDetail.lastmodifieddate.toString(),
        //     'lastmodifiedby': companyDetail.lastmodifiedby.toString(),
        //     'method': 'unit_save'
        // }
        // let objects = JSON.stringify(params_detail);
        //
        // alert(objects);


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
    //                     this.company = {
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
    //                         producttype: "Company",
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
    //                     this.onProductChanged.next(this.company);
    //                     resolve(this.company);
    //
    //                 // }, reject);
    //         }
    //     });
    // }
}
