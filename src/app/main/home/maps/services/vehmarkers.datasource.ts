import {CollectionViewer, DataSource} from "@angular/cdk/collections";
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service'
import { DocsComponentsThirdPartyGoogleMapsComponent } from "app/main/home/maps/google/google-maps.component";

// import { FuseUtils } from '@fuse/utils';


export class VehMarkersDataSource extends DataSource<any>
{
    private vehmarkersSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    // private countSubject = new BehaviorSubject<number>(0);
    // public counter$ = this.countSubject.asObservable();


    constructor(
        private _adminVehMarkersService: VehMarkersService,

        // private _matPaginator: any,
        // private pageIndex: number,
        // private pageSize: number,
        // private _matSort: MatSort
    ) {
        super();
    }

    loadVehicles(conncode: string, userid: number) {
        
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this._adminVehMarkersService.getVehMarkers(conncode, userid)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            
           
            this.vehmarkersSubject.next(result.TrackingXLAPI.DATA); 
        });
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.vehmarkersSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.vehmarkersSubject.complete();
        this.loadingSubject.complete();
    }
}