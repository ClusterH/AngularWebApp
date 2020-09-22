import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { ZonegroupDetailService } from 'app/main/admin/geofences/zonegroups/services/zonegroup_detail.service';
import { ZonegroupDetailComponent } from "app/main/admin/geofences/zonegroups/zonegroup_detail/zonegroup_detail.component";
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class ZonegroupDetailDataSource extends DataSource<any> {
    private zonegroupsSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    zonegroupDetailComponent: ZonegroupDetailComponent;

    constructor(private zonegroupDetailService: ZonegroupDetailService) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();
    }

    loadZonegroupDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.zonegroupDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.zonegroupsSubject.next(result.TrackingXLAPI.DATA);
                this.zonegroupDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.zonegroupsSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.zonegroupsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}