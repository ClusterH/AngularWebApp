import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class VehiclesDataSource extends DataSource<any> {
    public vehiclesSubject = new BehaviorSubject<any>([]);
    private _unsubscribeAll: Subject<any>;
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(private _adminVehiclesService: VehiclesService) {
        super(); this._unsubscribeAll = new Subject();
    }

    loadVehicles(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this._adminVehiclesService.getVehicles(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this._adminVehiclesService.vehicleList = result.TrackingXLAPI.DATA;
                this.vehiclesSubject.next(this._adminVehiclesService.vehicleList);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.vehiclesSubject.asObservable();
    }

    disconnect(): void {
        this.vehiclesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}