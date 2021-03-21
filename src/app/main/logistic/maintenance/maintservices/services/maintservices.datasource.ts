import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service'

export class MaintservicesDataSource extends DataSource<any> {
    public maintservicesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private maintservicesService: MaintservicesService,
    ) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadMaintservices(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        this.maintservicesService.getMaintservices(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
                this.maintservicesService.maintserviceList = result.TrackingXLAPI.DATA;
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadCompanyDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.maintservicesService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
                this.maintservicesService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadGroupDetail(pageindex: number, pagesize: number, name: string, companyid, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.maintservicesService.getGroups(pageindex, pagesize, name, companyid)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
                this.maintservicesService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadMaintenancegroupDetail(pageindex: number, pagesize: number, serviceid: string, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.maintservicesService.getItemDetail(pageindex, pagesize, serviceid, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
                this.maintservicesService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.maintservicesSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.maintservicesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}