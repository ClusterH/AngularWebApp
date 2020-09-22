import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service'
import { DocsComponentsThirdPartyGoogleMapsComponent } from "app/main/home/maps/google/google-maps.component";

export class VehMarkersDataSource extends DataSource<any> {
    private vehmarkersSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _adminVehMarkersService: VehMarkersService,
    ) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadVehicles() {
        this.loadingSubject.next(true);
        this._adminVehMarkersService.getVehMarkers()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.vehmarkersSubject.next(result.TrackingXLAPI.DATA);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.vehmarkersSubject.asObservable();
    }

    disconnect(): void {
        this.vehmarkersSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}