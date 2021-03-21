import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { ConnectionDetailService } from 'app/main/system/connections/services/connection_detail.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class ConnectionDetailDataSource extends DataSource<any> {
    private connectionsSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;

    constructor(private connectionDetailService: ConnectionDetailService) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();
    }

    loadConnectionDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.connectionDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.connectionsSubject.next(result.TrackingXLAPI.DATA);
                this.connectionDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.connectionsSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.connectionsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}