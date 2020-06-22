import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from "rxjs/operators";

import { HistoryService } from 'app/main/logistic/maintenance/history/services/history.service'

export class HistoryDataSource extends DataSource<any>
{
    public historySubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private _adminHistoryService: HistoryService,
    ) {
        super();
    }

    loadHistory(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string,method: string) {
        
        this.loadingSubject.next(true);
   
        // use pipe history to chain functions with Observable type
        this._adminHistoryService.getHistory(conncode, userid, pageindex, pagesize, orderby,  orderdirection, filterItem, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            
            

            this._adminHistoryService.maintHistoryList = result.TrackingXLAPI.DATA;

            this.historySubject.next(result.TrackingXLAPI.DATA);
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
            

            
        //    this.countSubject.next(result.TrackingXLAPI.DATA1);
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.historySubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.historySubject.complete();
        this.loadingSubject.complete();
    }
}