import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class JobsService {
    jobs: any[];
    public unit_clist_item: any = {};
    public jobList: any = [];
    boards: any[];
    onBoardsChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        this.onBoardsChanged = new BehaviorSubject([]);
    }

    getJobs(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string): Observable<any> {
        if (filterItem == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        } else {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
                .set('orderby', orderby.toString())
                .set('orderdirection', orderdirection.toString())
                .set(`${filterItem}`, `^${filterString}^`.toString())
                .set('method', method.toString());
            return this._httpClient.get('trackingxlapi.ashx', {
                params: params
            });
        }
    }

    getDetailClist(pageindex: number, pagesize: number, name: string, method: string): Observable<any> {
        if (name == '') {
            const params = new HttpParams()
                .set('pageindex', (pageindex + 1).toString())
                .set('pagesize', pagesize.toString())
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

    saveJob(jobDetail: any = {}): Observable<any> {
        const params_detail = new HttpParams()
            .set('id', jobDetail.id.toString())
            .set('imei', jobDetail.imei.toString())
            .set('vin', jobDetail.vin.toString())
            .set('plate', jobDetail.plate.toString())
            .set('customername', jobDetail.customername.toString())
            .set('address', jobDetail.address.toString())
            .set('customerphonenumber', jobDetail.customerphonenumber.toString())
            .set('scheduledate', jobDetail.scheduledate.toString())
            .set('duration', jobDetail.duration.toString())
            .set('installerid', jobDetail.installerid.toString())
            .set('installcontractorid', jobDetail.installcontractorid.toString())
            .set('startdate', jobDetail.startdate.toString())
            .set('enddate', jobDetail.enddate.toString())
            .set('createdby', jobDetail.createdby.toString())
            .set('created', jobDetail.created.toString())
            .set('isactive', jobDetail.isactive.toString())
            .set('deletedby', jobDetail.deletedby.toString())
            .set('deletedwhen', jobDetail.deletedwhen.toString())
            .set('longitude', jobDetail.longitude.toString())
            .set('latitude', jobDetail.latitude.toString())
            .set('statusid', jobDetail.statusid.toString())
            .set('installationjobtypeid', jobDetail.installationjobtypeid.toString())
            .set('description', jobDetail.description.toString())
            .set('devicetypeid', jobDetail.devicetypeid.toString())
            .set('notes', jobDetail.notes.toString())
            .set('method', 'installation_Save');
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params_detail
        });
    }

    deleteJob(id: string): Observable<any> {
        const params = new HttpParams()
            .set('id', id.toString())
            .set('method', "installation_Delete");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    Installationimages_TList(id: string): Observable<any> {
        const params = new HttpParams()
            .set('installationid', id.toString())
            .set('method', "Installationimages_TList");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    saveInstallationImages(id: any, images: any): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "installationid": id,
            "data": images,
            "method": "InstallationImages_Save",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }

        return this._httpClient.post('trackingxlapi.ashx', body);
    }

    deleteInstallationImages(id: any, images: any): Observable<any> {
        const token: string = localStorage.getItem('current_token') || '';
        const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
        const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        const body = {
            "installationid": id,
            "data": images,
            "method": "InstallationImages_Delete",
            "token": token,
            "conncode": conncode,
            "userid": userid
        }
        return this._httpClient.post('trackingxlapi.ashx', body);
    }

    assignInstallerToJob(installationid, installerid): Observable<any> {
        const params = new HttpParams()
            .set('installationid', installationid.toString())
            .set('installerid', installerid.toString())
            .set('method', "AssignInstallerToJob");
        return this._httpClient.get('trackingxlapi.ashx', {
            params: params
        });
    }

    getBoards(): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('method', "GetInstallationBoards");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            })
                .subscribe((response: any) => {
                    if (response.responseCode == 100) {
                        this.boards = JSON.parse(response.TrackingXLAPI.DATA[0].Column1).boards;
                        this.onBoardsChanged.next(this.boards);
                        resolve(this.boards);
                    }
                }, reject);
        });
    }
}