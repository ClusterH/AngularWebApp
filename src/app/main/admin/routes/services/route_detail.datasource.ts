import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service'
import { RoutesComponent } from "app/main/admin/routes/routes/routes.component";

export class RouteDetailDataSource extends DataSource<any>
{
    private routesSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
  
    flag: boolean =false;
    selected_method: string;
    selected_method_id: number;

    constructor(
        private routeDetailService: RouteDetailService,
    ) {
        super();
        this.flag = false;
    }

    loadRouteDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.routeDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.routesSubject.next(result.TrackingXLAPI.DATA);
            
            this.routeDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.routesSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.routesSubject.complete();
        this.loadingSubject.complete();
    }
}