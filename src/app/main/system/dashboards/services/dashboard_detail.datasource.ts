import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DashboardDetailService } from 'app/main/system/dashboards/services/dashboard_detail.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class DashboardDetailDataSource extends DataSource<any> {
    private dashboardsSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private dashboardDetailService: DashboardDetailService) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();
    }

    loadDashboardDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.dashboardDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.dashboardsSubject.next(result.TrackingXLAPI.DATA);
                this.dashboardDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.dashboardsSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.dashboardsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}