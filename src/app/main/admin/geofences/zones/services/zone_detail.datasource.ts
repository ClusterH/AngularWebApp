import { CollectionViewer, DataSource } from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

import { ZoneDetailService } from 'app/main/admin/geofences/zones/services/zone_detail.service'

export class ZoneDetailDataSource extends DataSource<any>
{
    private zonesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;

    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;

    constructor(
        private zoneDetailService: ZoneDetailService,
    ) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();

    }

    loadZoneDetail(pageindex: number, pagesize: number, name: string, method: string) {

        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.zoneDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {


                this.zonesSubject.next(result.TrackingXLAPI.DATA);

                this.zoneDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];


                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;

                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);


            }
            );
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {

        return this.zonesSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.zonesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}