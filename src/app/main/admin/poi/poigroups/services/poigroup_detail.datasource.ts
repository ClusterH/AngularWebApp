import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service'
// import { PoigroupsComponent } from "app/main/admin/poi/poigroups/poigroups/poigroups.component";
import { PoigroupDetailComponent } from "app/main/admin/poi/poigroups/poigroup_detail/poigroup_detail.component";

export class PoigroupDetailDataSource extends DataSource<any>
{
    private poigroupsSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
  
    flag: boolean =false;
    selected_method: string;
    selected_method_id: number;
    poigroupDetailComponent: PoigroupDetailComponent;

    constructor(
        private poigroupDetailService: PoigroupDetailService,
        // private poigroupDetailComponent: PoigroupDetailComponent
    ) {
        super();
        this.flag = false;
    }

    loadPoigroupDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.poigroupDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
            

            this.poigroupsSubject.next(result.TrackingXLAPI.DATA);
            this.poigroupDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
            // this.totalLength = result.TrackingXLAPI.DATA1?  result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0 : 0;
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
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