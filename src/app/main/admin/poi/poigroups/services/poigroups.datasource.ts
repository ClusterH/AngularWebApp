import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { PoigroupsService } from 'app/main/admin/poi/poigroups/services/poigroups.service'

export class PoigroupsDataSource extends DataSource<any>
{
    private poigroupsSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private _adminPoigroupsService: PoigroupsService,
      
    ) {
        super();
    }

    loadPoigroups(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string,method: string) {
        console.log("loadPoigroups:", conncode, userid,  pagesize, pageindex, orderdirection, orderby, filterItem, filterString, method );
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this._adminPoigroupsService.getPoigroups(conncode, userid, pageindex, pagesize, orderby,  orderdirection, filterItem, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           this.poigroupsSubject.next(result.TrackingXLAPI.DATA);
           this.totalLength = Number(result.TrackingXLAPI.DATA1.Total);
           this.page_index = pageindex + 1;
           this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        return this.poigroupsSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.poigroupsSubject.complete();
        this.loadingSubject.complete();
    }
}