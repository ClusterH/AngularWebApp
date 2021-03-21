import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { RoutesService } from 'app/main/admin/routes/services/routes.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class RoutesDataSource extends DataSource<any> {
    public routesSubject = new BehaviorSubject<any>([]);
    private _unsubscribeAll: Subject<any>;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(private _adminRoutesService: RoutesService) {
        super(); this._unsubscribeAll = new Subject();
    }

    loadRoutes(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this._adminRoutesService.getRoutes(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this._adminRoutesService.routeList = result.TrackingXLAPI.DATA;
                this.routesSubject.next(this._adminRoutesService.routeList);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
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