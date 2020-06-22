import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from "rxjs/operators";
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service'

export class MaintservicesDataSource extends DataSource<any>
{
    public maintservicesSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    constructor(
        private maintservicesService: MaintservicesService,
      
    ) {
        super();
    }

    loadMaintservices(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string,method: string) {
        
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this.maintservicesService.getMaintservices(conncode, userid, pageindex, pagesize, orderby,  orderdirection, filterItem, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            
            
           this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
           this.maintservicesService.maintserviceList = result.TrackingXLAPI.DATA;

           this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
           this.page_index = pageindex + 1;
           this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
           

           
        //    this.countSubject.next(result.TrackingXLAPI.DATA1);
          }
        );
    }

    loadCompanyDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.maintservicesService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
            
            this.maintservicesService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            
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
        this.maintservicesService.getGroups(conncode, userid, pageindex, pagesize, name, companyid)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
            this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
            
            this.maintservicesService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            // 
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            
          }
        );
    }

    loadMaintenancegroupDetail(conncode: string, userid: number, pageindex: number, pagesize: number, serviceid: string,  name: string, method: string) {
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.maintservicesService.getItemDetail(conncode, userid, pageindex, pagesize, serviceid, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
            

            this.maintservicesSubject.next(result.TrackingXLAPI.DATA);
            this.maintservicesService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
            // this.totalLength = result.TrackingXLAPI.DATA1?  result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0 : 0;
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.maintservicesSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.maintservicesSubject.complete();
        this.loadingSubject.complete();
    }
}