import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class RouteDetailDataSource extends DataSource<any> {
    private routesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    private _unsubscribeAll: Subject<any>;
    constructor(private routeDetailService: RouteDetailService) {
        super();
        this.flag = false;
        this._unsubscribeAll = new Subject();
    }

    loadRouteDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this.routeDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this.routesSubject.next(result.TrackingXLAPI.DATA);
                this.routeDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.routesSubject.asObservable();
    }

    disconnect(): void {
        this.routesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}