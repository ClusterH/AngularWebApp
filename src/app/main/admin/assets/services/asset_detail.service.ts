import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AssetDetailService {
    asset: any;
    public asset_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            if (method == 'model_clist') {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('makeid', this.current_makeID.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        } else {
            if (method == 'model_clist') {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('makeid', this.current_makeID.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            } else {
                let params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    headers: headers,
                    params: params
                });
            }
        }
    }

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        } else {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('name', `^${name}^`)
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
                headers: header_detail,
                params: params_detail
            });
        }
    }

    saveAssetDetail(assetDetail: any = {}): Observable<any> {
        const header_detail = new HttpHeaders().append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        const params_detail = new HttpParams()
            .set('id', assetDetail.id.toString())
            .set('name', assetDetail.name.toString())
            .set('companyid', assetDetail.companyid.toString())
            .set('groupid', assetDetail.groupid.toString())
            .set('subgroup', assetDetail.subgroup.toString())
            .set('operatorid', assetDetail.operatorid.toString())
            .set('accountid', assetDetail.accountid.toString())
            .set('unittypeid', assetDetail.unittypeid.toString())
            .set('serviceplanid', assetDetail.serviceplanid.toString())
            .set('producttypeid', assetDetail.producttypeid.toString())
            .set('makeid', assetDetail.makeid.toString())
            .set('modelid', assetDetail.modelid.toString())
            .set('isactive', assetDetail.isactive.toString())
            .set('timezoneid', assetDetail.timezoneid.toString())
            .set('created', assetDetail.created.toString())
            .set('createdby', assetDetail.createdby.toString())
            .set('deletedwhen', assetDetail.deletedwhen.toString())
            .set('deletedby', assetDetail.deletedby.toString())
            .set('lastmodifieddate', assetDetail.lastmodifieddate.toString())
            .set('lastmodifiedby', assetDetail.lastmodifiedby.toString())
            .set('method', 'unit_save');
        return this._httpClient.get('trackingxlapi.ashx', {
            headers: header_detail,
            params: params_detail
        });
    }
}