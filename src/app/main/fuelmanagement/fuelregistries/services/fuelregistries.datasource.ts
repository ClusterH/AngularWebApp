import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { FuelregistriesService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistries.service'
import { FuelregistriesComponent } from "app/main/fuelmanagement/fuelregistries/fuelregistries/fuelregistries.component";

export class FuelregistriesDataSource extends DataSource<any> {
    public fuelregistriesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _adminFuelregistriesService: FuelregistriesService,
    ) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadFuelregistries(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        this._adminFuelregistriesService.getFuelregistries(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this._adminFuelregistriesService.fuelregistryList = result.TrackingXLAPI.DATA;
                this.fuelregistriesSubject.next(this._adminFuelregistriesService.fuelregistryList);
                this.totalLength = this._adminFuelregistriesService.fuelregistryList.length;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.fuelregistriesSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.fuelregistriesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}