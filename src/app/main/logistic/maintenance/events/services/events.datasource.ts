import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from "rxjs/operators";
import { EventsService } from 'app/main/logistic/maintenance/events/services/events.service'

export class EventsDataSource extends DataSource<any>
{
    public eventsSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private _adminEventsService: EventsService,
      
    ) {
        super();
    }

    loadEvents(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string,method: string) {
        
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this._adminEventsService.getEvents(conncode, userid, pageindex, pagesize, orderby,  orderdirection, filterItem, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            
            
           this.eventsSubject.next(result.TrackingXLAPI.DATA);
           this._adminEventsService.mainteventList = result.TrackingXLAPI.DATA;

           this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
           this.page_index = pageindex + 1;
           this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
           

           
        //    this.countSubject.next(result.TrackingXLAPI.DATA1);
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.eventsSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.eventsSubject.complete();
        this.loadingSubject.complete();
    }
}