import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { ZonegroupDetailService } from 'app/main/admin/geofences/zonegroups/services/zonegroup_detail.service'
import { ZonegroupDetailComponent } from "app/main/admin/geofences/zonegroups/zonegroup_detail/zonegroup_detail.component";

export class ZonegroupDetailDataSource extends DataSource<any>
{
    private zonegroupsSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
  
    flag: boolean =false;
    selected_method: string;
    selected_method_id: number;
    zonegroupDetailComponent: ZonegroupDetailComponent;

    constructor(
        private zonegroupDetailService: ZonegroupDetailService,
        // private zonegroupDetailComponent: ZonegroupDetailComponent
    ) {
        super();
        this.flag = false;
    }

    loadZonegroupDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.zonegroupDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
            

            this.zonegroupsSubject.next(result.TrackingXLAPI.DATA);
            this.zonegroupDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
            // this.totalLength = result.TrackingXLAPI.DATA1?  result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0 : 0;
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        return this.zonegroupsSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.zonegroupsSubject.complete();
        this.loadingSubject.complete();
    }
}