import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { ServiceplansService } from 'app/main/system/serviceplans/services/serviceplans.service'

export class ServiceplansDataSource extends DataSource<any> {
    public serviceplansSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(private _systemServiceplansService: ServiceplansService) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadServiceplans(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        this._systemServiceplansService.getServiceplans(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this._systemServiceplansService.serviceplanList = result.TrackingXLAPI.DATA;
                this.serviceplansSubject.next(result.TrackingXLAPI.DATA);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.serviceplansSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.serviceplansSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}