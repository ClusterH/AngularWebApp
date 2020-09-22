import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service'
import { PoigroupDetailComponent } from "app/main/admin/poi/poigroups/poigroup_detail/poigroup_detail.component";

export class PoigroupDetailDataSource extends DataSource<any> {
    private poigroupsSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    poigroupDetailComponent: PoigroupDetailComponent;
    private _unsubscribeAll: Subject<any>;

    constructor(private poigroupDetailService: PoigroupDetailService) {
        super();
        this.flag = false;
        this._unsubscribeAll = new Subject();
    }

    loadPoigroupDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.poigroupDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.poigroupsSubject.next(result.TrackingXLAPI.DATA);
                this.poigroupDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                // this.totalLength = result.TrackingXLAPI.DATA1?  result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0 : 0;
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.poigroupsSubject.asObservable();
    }

    disconnect(): void {
        this.poigroupsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}