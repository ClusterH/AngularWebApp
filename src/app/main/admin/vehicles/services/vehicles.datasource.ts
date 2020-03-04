import {CollectionViewer, DataSource} from "@angular/cdk/collections";
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service'
// import { FuseUtils } from '@fuse/utils';


export class VehiclesDataSource extends DataSource<any>
{
    private vehiclesSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    // private countSubject = new BehaviorSubject<number>(0);
    // public counter$ = this.countSubject.asObservable();


    constructor(
        private _adminVehiclesService: VehiclesService,
        // private _matPaginator: any,
        // private pageIndex: number,
        // private pageSize: number,
        // private _matSort: MatSort
    ) {
        super();
    }

    loadVehicles(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, method: string) {
        console.log("loadVehicles:", conncode, userid,  pagesize, pageindex, orderdirection, orderby, method );
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this._adminVehiclesService.getVehicles(conncode, userid, pageindex, pagesize, orderby, orderdirection, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            console.log(result);
           this.vehiclesSubject.next(result.TrackingXLAPI.DATA);
        //    this.countSubject.next(result.TrackingXLAPI.DATA1);
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        console.log("Connecting data source");
        return this.vehiclesSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.vehiclesSubject.complete();
        this.loadingSubject.complete();
    }
}