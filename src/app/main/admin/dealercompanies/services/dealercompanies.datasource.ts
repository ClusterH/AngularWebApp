import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DealercompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class DealercompaniesDataSource extends DataSource<any> {
    public dealercompaniesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private _adminDealercompaniesService: DealercompaniesService,
    ) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadDealercompanies(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        this._adminDealercompaniesService.getDealercompanies(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this._adminDealercompaniesService.dealercompanyList = result.TrackingXLAPI.DATA;
                this.dealercompaniesSubject.next(result.TrackingXLAPI.DATA);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.dealercompaniesSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.dealercompaniesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}