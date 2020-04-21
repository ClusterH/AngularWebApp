import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { DevConfigDetailService } from 'app/main/system/devconfigs/services/devconfig_detail.service'
import { DevConfigsComponent } from "app/main/system/devconfigs/devconfigs/devconfigs.component";

export class DevConfigDetailDataSource extends DataSource<any>
{
    private devconfigsSubject = new BehaviorSubject<any>([]);

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
        private devconfigDetailService: DevConfigDetailService,
    ) {
        super();
        this.flag = false;
    }

    loadDevConfigDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        console.log("loadDevConfigs:", conncode, userid,  pageindex, pagesize, name, method );
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.devconfigDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           console.log("method:", method, result);
       
            this.devconfigsSubject.next(result.TrackingXLAPI.DATA);
            console.log(result.TrackingXLAPI.DATA);
            this.devconfigDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            console.log("unit_clist: ", this.devconfigDetailService.unit_clist_item);
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            console.log(this.totalLength);   
          }
        );
     }

    loadDevConfigCmd(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, filterstring: string, method: string) {
        console.log("loadDevConfigs:", conncode, userid,  pagesize, pageindex, name, filterstring, method );
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.devconfigDetailService.getDevConfigCmd(conncode, userid, pageindex, pagesize, name, filterstring, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           console.log("method:", method, result);
       
            this.devconfigsSubject.next(result.TrackingXLAPI.DATA);
            console.log(result.TrackingXLAPI.DATA);
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            console.log(this.totalLength);   
          }
        );
    }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        console.log("Connecting data source");
        return this.devconfigsSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.devconfigsSubject.complete();
        this.loadingSubject.complete();
    }
}