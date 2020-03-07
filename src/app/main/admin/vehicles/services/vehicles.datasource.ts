import {CollectionViewer, DataSource} from "@angular/cdk/collections";
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service'
import { VehiclesComponent } from "app/main/admin/vehicles/vehicles/vehicles.component";

// import { FuseUtils } from '@fuse/utils';


export class VehiclesDataSource extends DataSource<any>
{
    private vehiclesSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
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

    loadVehicles(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string,method: string) {
        console.log("loadVehicles:", conncode, userid,  pagesize, pageindex, orderdirection, orderby, filterItem, filterString, method );
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this._adminVehiclesService.getVehicles(conncode, userid, pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            console.log(result);
           this.vehiclesSubject.next(result.TrackingXLAPI.DATA);
           this.totalLength = Number(result.TrackingXLAPI.DATA1.Total);
           this.page_index = pageindex + 1;
           this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

           console.log(this.totalLength);
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