import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { SimcardDetailService } from 'app/main/system/simcards/services/simcard_detail.service'
import { SimcardsComponent } from "app/main/system/simcards/simcards/simcards.component";

export class SimcardDetailDataSource extends DataSource<any>
{
    private simcardsSubject = new BehaviorSubject<any>([]);

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
        private simcardDetailService: SimcardDetailService,
    ) {
        super();
        this.flag = false;
    }

    loadSimcardDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.simcardDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.simcardsSubject.next(result.TrackingXLAPI.DATA);
            
            this.simcardDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.simcardsSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.simcardsSubject.complete();
        this.loadingSubject.complete();
    }
}