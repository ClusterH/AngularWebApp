import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { EventDetailService } from 'app/main/logistic/maintenance/events/services/event_detail.service'

export class EventDetailDataSource extends DataSource<any>
{
    public eventsSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
  
    flag: boolean =false;
    selected_method: string;
    selected_method_id: number;
    currentPage_unit_data: any;


    constructor(
        private eventDetailService: EventDetailService,
    ) {
        super();
        this.flag = false;
    }

    loadCompanyDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.eventDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.eventsSubject.next(result.TrackingXLAPI.DATA);
            
            this.eventDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            // 
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            
          }
        );
    }

    loadGroupDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, companyid, method: string) {
        
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.eventDetailService.getGroups(conncode, userid, pageindex, pagesize, name, companyid)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.eventsSubject.next(result.TrackingXLAPI.DATA);
            
            this.eventDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            // 
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
          }
        );
    }


    loadUnitDetail(conncode: string, userid: number, pageindex: number, pagesize: number, companyid: string, groupid: string, eventid: string) {
        
       
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.eventDetailService.getUnits(conncode, userid, pageindex, pagesize, companyid, groupid, eventid)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.eventsSubject.next(result.TrackingXLAPI.DATA);
            
            this.currentPage_unit_data = result.TrackingXLAPI.DATA;
          
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            
          }
        );
    }

    loadMaintEventUnits(conncode: string, userid: number, pageindex: number, pagesize: number, eventid: string, groupid: string,  name: string, method: string) {
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.eventDetailService.getEventUnits(conncode, userid, pageindex, pagesize, eventid, groupid,  name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
            

            this.eventsSubject.next(result.TrackingXLAPI.DATA);
            this.eventDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
            // this.totalLength = result.TrackingXLAPI.DATA1?  result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0 : 0;
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
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