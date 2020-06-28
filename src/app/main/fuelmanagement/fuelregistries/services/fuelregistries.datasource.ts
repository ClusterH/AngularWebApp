import {CollectionViewer, DataSource} from "@angular/cdk/collections";
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { FuelregistriesService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistries.service'
import { FuelregistriesComponent } from "app/main/fuelmanagement/fuelregistries/fuelregistries/fuelregistries.component";

// import { FuseUtils } from '@fuse/utils';


export class FuelregistriesDataSource extends DataSource<any>
{
    public fuelregistriesSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private _adminFuelregistriesService: FuelregistriesService,
      
    ) {
        super();
    }

    loadFuelregistries(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string,method: string) {
        
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this._adminFuelregistriesService.getFuelregistries(conncode, userid, pageindex, pagesize, orderby,  orderdirection, filterItem, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            
            this._adminFuelregistriesService.fuelregistryList = result.TrackingXLAPI.DATA;

            this.fuelregistriesSubject.next(this._adminFuelregistriesService.fuelregistryList);
            // this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.totalLength = this._adminFuelregistriesService.fuelregistryList.length;
            
            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
        //    this.countSubject.next(result.TrackingXLAPI.DATA1);
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.fuelregistriesSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.fuelregistriesSubject.complete();
        this.loadingSubject.complete();
    }
}