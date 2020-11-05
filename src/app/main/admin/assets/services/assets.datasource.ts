import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { AssetsService } from 'app/main/admin/assets/services/assets.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class AssetsDataSource extends DataSource<any> {
    public assetsSubject = new BehaviorSubject<any>([]);
    private _unsubscribeAll: Subject<any>;
    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(private _adminAssetsService: AssetsService) {
        super(); this._unsubscribeAll = new Subject();
    }

    loadAssets(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this._adminAssetsService.getAssets(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {

                this._adminAssetsService.assetList = result.TrackingXLAPI.DATA;
                this.assetsSubject.next(this._adminAssetsService.assetList);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.assetsSubject.asObservable();
    }

    disconnect(): void {
        this.assetsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}