import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class VehicleDetailService {
    vehicle: any;
    public vehicle_detail: any;
    public unit_clist_item: any = {};
    public current_makeID: number;

    constructor(private _httpClient: HttpClient) { }

    getCompanies(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            if (method == 'model_clist') {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('makeid', this.current_makeID.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            } else {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            }
        } else {
            if (method == 'model_clist') {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('makeid', this.current_makeID.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            } else {
                const params = new HttpParams()
                    .set('pageindex', (pageindex + 1).toString())
                    .set('pagesize', pagesize.toString())
                    .set('name', `^${name}^`)
                    .set('method', method.toString());
                return this._httpClient.get('trackingxlapi.ashx', {
                    params: params
                });
            }
        }
    }

    getGroups(pageindex: number, pagesize: number, name: string, companyid: number): Observable<any> {
        if (name == '') {
            const params_detail = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('companyid', companyid.toString())
                .set('method', 'group_CList');
            return this._httpClient.get('trackingxlapi.ashx', {
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
                params: params_detail
            });
        }
    }

    saveVehicleDetail(vehicleDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
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
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }
}