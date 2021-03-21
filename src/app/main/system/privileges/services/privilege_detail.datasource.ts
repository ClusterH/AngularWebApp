import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { PrivilegeDetailService } from 'app/main/system/privileges/services/privilege_detail.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class PrivilegeDetailDataSource extends DataSource<any> {
    private privilegesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private privilegeDetailService: PrivilegeDetailService) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();
    }

    loadPrivilegeDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.privilegeDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.privilegesSubject.next(result.TrackingXLAPI.DATA);
                this.privilegeDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.privilegesSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.privilegesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}