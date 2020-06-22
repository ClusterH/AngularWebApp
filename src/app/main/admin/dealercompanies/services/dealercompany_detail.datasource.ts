import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { DealerCompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service'
import { DealerCompaniesComponent } from "app/main/admin/dealercompanies/dealercompanies/dealercompanies.component";

export class DealerCompanyDetailDataSource extends DataSource<any>
{
    private companiesSubject = new BehaviorSubject<any>([]);

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
        private dealercompanyDetailService: DealerCompanyDetailService,
    ) {
        super();
        this.flag = false;
    }

    loadDealerCompanyDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.dealercompanyDetailService.getDealerCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           
       
                this.companiesSubject.next(result.TrackingXLAPI.DATA);
                
            this.dealercompanyDetailService.dealercompany_clist_item[`${method}`] = result.TrackingXLAPI.DATA;
          
            
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        
        return this.companiesSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.companiesSubject.complete();
        this.loadingSubject.complete();
    }
}